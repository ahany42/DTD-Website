import React, { useState, useRef, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = crypto.randomUUID();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        { sender: "bot", text: "Hi there 👋! How can I help you today?" },
      ]);
    }
  };

  function parseMessageText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex))
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {part}
          </a>
        );
      const boldParts = [];
      let lastIndex = 0,
        match;
      while ((match = boldRegex.exec(part)) !== null) {
        if (match.index > lastIndex)
          boldParts.push(part.substring(lastIndex, match.index));
        boldParts.push(<b key={index + "-" + match.index}>{match[1]}</b>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < part.length) boldParts.push(part.substring(lastIndex));
      return boldParts;
    });
  }

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userInput = input;
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput, sessionId }),
      });
      const data = await res.json();
      const aiText = data[0]?.output || "No response available.";
      setMessages((prev) => [...prev, { sender: "bot", text: aiText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "There was an error contacting the server." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <div onClick={openChat} className="open-chat-icon">
        💬
      </div>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="chat-overlay"></div>
      )}

      {isOpen && (
        <div className="chat-widget-popup">
          <div className="chat-header">
            <div>
              <FaRobot /> DTD Assistant
            </div>
            <span onClick={() => setIsOpen(false)}>✖</span>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.sender === "bot" && <FaRobot size={28} color="var(--primary-color)" />}
                <div className={`chat-bubble ${msg.sender}`}>
                  {parseMessageText(msg.text)}
                </div>
              </div>
            ))}
            {loading && <div className="chat-loading">Typing…</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 200))}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask something..."
              />
              <button onClick={sendMessage}>➤</button>
            </div>
            <div className="chat-input-counter">{input.length}/200</div>
          </div>
        </div>
      )}
    </>
  );
}
