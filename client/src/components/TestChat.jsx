import { useChat } from "../context/ChatContext";

const TestChat = () => {
  const { selectedChat, setSelectedChat } = useChat();

  return (
    <div>
      <h2>Selected Chat: {selectedChat ? selectedChat : "None"}</h2>
      <button onClick={() => setSelectedChat("User123")}>
        Select User123
      </button>
    </div>
  );
};

export default TestChat;
