import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // have to change this ...........
});


// Connect to Database
connectDB();

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("API is running...");
})
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user-online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("send-message", async ({ senderId, receiverId, message }) => {
        try {
            // Store the message in MongoDB
            const newMessage = new MessageChannel({ sender: senderId, receiver: receiverId, message });
            await newMessage.save();

            // Emit the message to the receiver if they are online
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverId) {
                io.to(receiverId).emit("receive-message", { senderId, message });
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
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});