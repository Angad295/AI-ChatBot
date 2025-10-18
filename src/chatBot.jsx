import React, { useState } from "react";
import ChatMessage from "./chatMessage";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const botMsg = { sender: "bot", text: getBotResponse(input) };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  const getBotResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("admission")) {
      return "Admissions begin in November. Visit the college portal for details.";
    } else if (lower.includes("exam")) {
      return "Final exams are scheduled for the first week of December.";
    } else if (lower.includes("contact")) {
      return "Reach us at admin@college.edu or call +91-1234567890.";
    } else {
      return "Thanks for your question! We'll get back to you soon.";
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🎓 College Chatbot</div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <ChatMessage key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
