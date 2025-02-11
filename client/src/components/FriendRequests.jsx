import React, { useContext } from 'react'
import { FriendsContext } from '../context/FriendsContext'

const FriendRequests = () => {

    const { friendRequests, acceptFriendRequest, declineFriendRequests } = useContext(FriendsContext);

    return (
        <div>
            <h2>Friend Requests</h2>
            {friendRequests.length === 0 ? (
                <p>No pending friend request</p>
            ):(
                friendRequests.map((request) => (
                    <div key={request.id}>
                        <p>{request.senderName}</p>
                        <div>
                            <button onClick={() => acceptFriendRequest(request._id)}>Accept</button>
                            <button onClick={() => declineFriendRequests(request._id)}>Decline</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default FriendRequests