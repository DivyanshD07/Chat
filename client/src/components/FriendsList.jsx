import React, { useContext } from 'react'
import { FriendsContext } from '../context/FriendsContext'

const FriendsList = () => { 
    const { friends, onlineUsers } = useContext(FriendsContext);
  return (
    <div>
        <ul>
            {friends.map((friend) => (
                <li key={friend._id}>
                    {friend.username} {onlineUsers.includes(friend._id) ? "🟢" : "⚪"}
                </li>
            ))}
        </ul>
    </div>
  )
}

export default FriendsList