import "./Chat.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

function Chat() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState([]);
  const email = localStorage.getItem("UserEmail") || "";
  const chatEndRef = useRef(null);

  // 🟦 1. Fetch chat history & setup socket
  useEffect(() => {
    // Load old messages
    axios.get("http://localhost:7000/msg")
      .then(res => setMessage(res.data))
      .catch(console.error);

    // Avoid multiple listeners
    socket.off("chat:message");
    socket.connect();

    socket.on("chat:message", m =>
      setMessage(prev => [...prev, m])
    );

    return () => {
      socket.off("chat:message");
      socket.disconnect();
    };
  }, []);

  // 🟦 2. Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // 🟦 3. Send message via socket
  const handleSend = () => {
    if (!text.trim()) return;

    socket.emit("chat:message", {
      text,
      createdAt: Date.now()
    });

    setText(""); // clear input
  };

  // 🟦 4. Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserEmail");
    window.location.href = "/signin";
  };

  // 🟦 5. Render UI
  return (
    <div className="main-chat-container">
      <div className="chat-header">
        <h2 className="chat-title">💬 Welcome to Chat Room</h2>
        <div className="user-info">
          <p><strong>User:</strong> {email}</p>
          <button className="chat-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="chat-box chat-messages">
        {message.map((m, i) => (
          <div key={i} className={`message ${m.email === email ? 'sender' : 'receiver'}`}>
            <strong>{m.email === email ? "You" : m.email}</strong>
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="input-field">
        <input
          value={text}
          type="text"
          onChange={e => setText(e.target.value)}
          placeholder="Type your message…"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
