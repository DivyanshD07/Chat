import React, { useState } from 'react'
import "../styles/Chat.css"

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if(!input.trim()) return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  }
  return (
    <div className='chat-container'>
      {/* SideBar for friends */}
      <div>
        <h3>Friends</h3>
        <ul>
          <li>User1</li>
          <li>User2</li>
        </ul>
      </div>

      {/* Chat window  */}
      <div className='chat-window'>
        <div className='messages'>
          {messages.map((msg, index)=> (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Field  */}
        <div className='input-area'>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message...'   
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat