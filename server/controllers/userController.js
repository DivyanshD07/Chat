import User from "../models/User.js"

// Search users by username
export const searchUser = async (req, res) => {
    try {
        const { username } = req.query;
        const users = await User.find(
            {
                username: { $regex: new RegExp(username, "i") }
            },
            "username _id"
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Send Friend Requests
export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.user._id; // User sending request
        const { recepientId } = req.body; // User receiving request

        // Check if recepient exists
        const recepient = await User.findById(recepientId);
        if (!recepient) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already send
        if (recepient.friendRequests.includes(userId)) {
            return res.status(400).json({ message: "Request already send" });
        }

        // Add userId to recepients
        recepient.friendRequests.push(userId);
        await recepient.save();

        res.json({ message: "Friend Request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// User accepts or rejects friend requests
export const respondToFriendRequest = async (req, res) => {
    try {
        const { userId } = req.user._id;
        const { senderId, action } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        if (!user.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "No friend request from this user" });
        }

        if (action == "accept") {
            user.friends.push(senderId);
            const sender = await User.findById(senderId);
            sender.friends.push(userId);
            await sender.save();
        }

        // Remove request from friendRequests array
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
        await user.save();

        res.json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}