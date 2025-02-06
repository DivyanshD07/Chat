import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMessages, markMessagesAsSeen, sendMessage } from "../controllers/messageController.js";
import { messageLimiter } from "../middleware/rateLimiter.js";


const router = express.Router();

router.use(verifyToken);
router.post("/send", messageLimiter, sendMessage);
router.get("/:userId", getMessages);
router.put("/seen/:userId", markMessagesAsSeen);

export default router;