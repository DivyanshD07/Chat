import React, { useContext, useEffect, useState } from 'react'
import { FriendsContext } from '../context/FriendsContext'
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRef } from 'react';

const Chat = () => {

  const { user } = useAuth();
  const { friends } = useContext(FriendsContext);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const backendPort = import.meta.env.VITE_BACKEND_URL;
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(backendPort, { auth: { token: user?.token } });

    return () => {
      socketRef.current.disconnect();
    }
  }, [user]);

  // Fetch chat history when a friend is selected
  useEffect(() => {
    if (!selectedFriend) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${backendPort}/api/messages/${selectedFriend._id}`, { withCredentials: true });
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedFriend]);

  // Handle receiving messages in real-time
  useEffect(() => {
    if (!user) return;

    socketRef.current = io(backendPort, { auth: { token: user?.token } })
    
    socketRef.current.on("receive-message", (message) => {
      if (message.sender === selectedFriend?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current.off("receive-message");
    };
  }, [selectedFriend]);


  // Handle sending messages
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedFriend || !newMessage.trim()) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedFriend._id,
      message: newMessage,
    };

    try {
      await axios.post(`${backendPort}/api/messages/send`, messageData, { withCredentials: true });

      // Emit message event
      socketRef.current.emit("send-message", messageData);

      // Update Local chat UI
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div>
      {/* Left Panel */}
      <div>
        <h2>Friends</h2>
        <ul>
          {friends?.length > 0 ? (friends.map((friend) => (
            <li
              key={friend._id}
              onClick={() => setSelectedFriend(friend)}
            >
              {friend.username}
            </li>
          ))
          ) : (
            <p>No friends found</p>
          )}
        </ul>
      </div>
      {/* Right Panel */}
      <div>
        {selectedFriend ? (
          <>
            <h2>{selectedFriend.username}</h2>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.message}
                </div>
              ))}
            </div>
            <div>
              <input
                type="text"
                placeholder='Type a message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>
            Select a friend to start chatting
          </p>
        )}
      </div>
    </div>
  )
}

export default Chat