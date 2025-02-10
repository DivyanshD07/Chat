import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import User from "../models/User.js"
import { checkUserStatus, friendRequestsReceived, friendsList, respondToFriendRequest, searchUser, sendFriendRequest } from "../controllers/userController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/friend/status", checkUserStatus)
router.get("/search", searchUser);
router.post("/send-friend-request", sendFriendRequest);
router.post("/respond-to-friend-request", respondToFriendRequest);
router.get("/friends", friendsList);
router.get("/friend-requests", friendRequestsReceived);
router.get("/:userId", async(req,res) => {
    try {
        const id = req.params;
        console.log(id);
        const user = await User.findById(id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;