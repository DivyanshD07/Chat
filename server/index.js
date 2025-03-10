import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import MessageChannel from "./models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, // have to change this ...........
        credentials: true
    }
});


// Connect to Database
connectDB();

// Middleware
app.use(express.json())
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
)); // have to change this too .... for security reasons (Unauthorized can access right now have to change this so that only client_url can access)

//
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204); // Handle preflight OPTIONS request
})


app.use(cookieParser());
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});
app.get("/", (req, res) => {
    res.send("API is running...");
})
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

export const onlineUsers = new Map();

// Secure websoket Connections
io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token; // Get token from WebSocket author query
    if (!token) return next(new Error("Authentication error"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Store user as online
    socket.on("user-online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    // Secure Messaging
    socket.on("send-message", async ({ receiverId, message }) => {
        try {

            if (!socket.userId) return;

            // Store the message in MongoDB
            const newMessage = new MessageChannel({ sender: socket.userId, receiver: receiverId, message });
            await newMessage.save();

            // Emit the message to the receiver if they are online
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", { senderId: socket.userId, message });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    })

    socket.on("logout", (userId) => {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    })

    socket.on("disconnect", () => {
        const userIdToRemove = [...onlineUsers.entries()].find(([userId, socketId]) => socketId === socket.id);
        if(userIdToRemove) {
            onlineUsers.delete(userIdToRemove[0]);
        }
        // for (const [userId, socketId] of onlineUsers.entries()) {
        //     if (socketId === socket.id) {
        //         onlineUsers.delete(userId);
        //         break;
        //     }
        // }
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});