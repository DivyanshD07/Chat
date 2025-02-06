import Message from "../models/Message.js"

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message,
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
        const loggedInUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId, receiver: userId },
                { sender: userId, receiver: loggedInUserId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
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