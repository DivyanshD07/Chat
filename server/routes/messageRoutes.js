import express from "express"
import { verifyToken } from "../middleware/authMiddleware";
import { getMessages, markMessagesAsSeen, sendMessage } from "../controllers/messageController";


const router = express.Router();

router.use(verifyToken);
router.post("/send", sendMessage);
router.get("/:userId", getMessages);
router.put("/seen/:userId", markMessagesAsSeen);

export default router;