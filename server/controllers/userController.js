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