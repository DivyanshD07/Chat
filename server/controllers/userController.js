import User from "../models/User.js"
import { onlineUsers } from "../index.js";

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

        // console.log("Request user:", req.user);

        // if (!req.user || !req.user.id) { 
        //     return res.status(401).json({ message: "Unauthorized: No user data found" });
        // }

        const userId = req.user.id; // User sending request
        const { recepientId } = req.body; // User receiving request


        // console.log("Sender ID:", userId);
        // console.log("Receiver ID:", recepientId);

        if (!recepientId) {
            return res.status(400).json({ message: "RecepientId is required " })
        }

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
        res.status(500).json({ message: error.message });
    }
}

// User accepts or rejects friend requests
export const respondToFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
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

// Fetch the friends list
export const friendsList = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("friends", "username email"); // Populate friends details

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.json(user.friends);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

// Fetch the friend requests
export const friendRequestsReceived = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("friendRequests", "username email");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.friendRequests);
    } catch (error) {
        res.json(500).json({ error: "Server error" });
    }
};

// Online or offline
export const checkUserStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate("friends", "username");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Map through friends who are online
        const friendsStatus = user.friends.map((friend) => ({
            id: friend._id,
            username: friend.username,
            online: onlineUsers.has(friend._id.toString()),
        }));

        res.json({ friendsStatus });
    } catch (error) {
        console.error("Error fetching friends' online status:", error);
        res.status(500).josn({ message: "Server error" });
    }
};