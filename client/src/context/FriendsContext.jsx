import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);


    // Initialize websocket once 
    useEffect(() => {
        if (!user || socketRef.current) return; // Prevent multiple connections

        console.log("🔗 Connecting to WebSocket..."); // Debug log
        socketRef.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
            query: { token: user.token },
            reconnectionAttempts: 5, // Optional: Limit reconnection attempts
            reconnectionDelay: 3000, // Optional: Add a delay before reconnecting
        });

        socketRef.current.on("connect", () => {
            console.log("✅ WebSocket connected:", socketRef.current.id);
            socketRef.current.emit("user-online", user._id);
        });

        socketRef.current.on("disconnect", (reason) => {
            console.warn("❌ WebSocket disconnected:", reason);
        });

        socketRef.current.on("connect_error", (error) => {
            console.error("⚠️ WebSocket connection error:", error);
        });

        socketRef.current.on("online-users", (onlineUsersList) => {
            setOnlineUsers(onlineUsersList);
        });

        return () => {
            if (socketRef.current) {
                console.log("🔴 Disconnecting WebSocket...");
                socketRef.current.disconnect();
                socketRef.current = null; // cleanup reference
            }
        };
    }, [user]);


    // Fetch friends list
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/friends`, { withCredentials: true });
                console.log("Friends Api response:", response);
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        if (user) fetchFriends();
    }, [user]);

    // Fetch friend Requests
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/friend-requests`, { withCredentials: true });
                setFriendRequests(data);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        };

        if (user) fetchFriendRequests();
    }, [user]);

    // Accept friend request
    const acceptFriendRequest = async (senderId) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/respond-to-friend-request`,
                { senderId, action: "accept" },
                { withCredentials: true }
            );
            setFriendRequests(friendRequests.filter(req => req._id !== senderId));
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    // Decline friend Request
    const declineFriendRequest = async (senderId) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/respond-to-friend-request`,
                { senderId, action: "decline" },
                { withCredentials: true }
            );
            setFriendRequests(friendRequests.filter(req => req._id !== senderId));
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    return (
        <FriendsContext.Provider value={{ user, friends, onlineUsers, friendRequests, acceptFriendRequest, declineFriendRequest }}>
            {children}
        </FriendsContext.Provider>
    )
}