import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.send("API is running...");
})
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});