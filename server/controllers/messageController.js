import Message from "../models/Message.js"
import CryptoJS from "crypto-js";

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        const secretKey = process.env.MESSAGE_SECRET
        const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey).toString();

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            encryptedMessage,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get messages between Two Users
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUserId = req.user.id; // Current User

        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId, receiver: userId },
                { sender: userId, receiver: loggedInUserId },
            ],
        }).sort({ createdAt: 1 });

        // Decrypt messages before sending response
        const secretKey = process.env.MESSAGE_SECRET;
        const decryptedMessages = messages.map(msg => ({
            ...msg.toObject(),
            message: CryptoJS.AES.decrypt(msg.encryptedMessage, secretKey).toString(CryptoJS.enc.Utf8),
        }));

        res.status(200).json(decryptedMessages);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Mark Messages as Seen
export const markMessagesAsSeen = async(req, res) => {
    try{
        const { userId } = req.params;
        const loggedInUserId = req.user.id;
        
        await Message.updateMany(
            {
                sender: userId,
                receiver: loggedInUserId,
                seen: false,
            },{
                $set: {
                    seen: true
                }
            }
        );

        res.status(200).json({ message: "Message marked as seen" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}