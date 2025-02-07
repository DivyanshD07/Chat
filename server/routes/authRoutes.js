import express from "express"
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js"
import verifyToken from "../middleware/authMiddleware.js"
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})


export default router;