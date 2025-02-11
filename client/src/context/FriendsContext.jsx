import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = io(import.meta.env.VITE_BACKEND_URL, { auth: { token: user?.token } });

    // Fetch friends list
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/friends`, {withCredentials: true}); 
                setFriends(data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        if(user) fetchFriends();
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

        if(user) fetchFriendRequests();
    }, [user]);

    // Accept friend request
    const acceptFriendRequest = async (senderId) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/respond-to-friend-request`, 
                { senderId, action: "accept" },
                { withCredentials: true }
            );
            setFriendRequests(friendRequests.filter(req=> req._id !== senderId));
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    // Decline friend Request
    const declineFriendRequest = async (senderId) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/respond-to-friend-request`, 
                { senderId, action: "accept" },
                { withCredentials: true }
            );
            setFriendRequests(friendRequests.filter(req=> req._id !== senderId));
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    // Handle online status with WebSocket
    useEffect(() => {
        if(!user) return;

        socket.emit("user-online", user._id);

        socket.on("online-users", (onlineUsersList) => {
            setOnlineUsers(onlineUsersList);
        });

        return () => {
            socket.disconnect();
        }
    }, [user]);

    return (
        <FriendsContext.Provider value={{ user, friends, onlineUsers, friendRequests, acceptFriendRequest, declineFriendRequest }}>
            {children}
        </FriendsContext.Provider>
    )
}