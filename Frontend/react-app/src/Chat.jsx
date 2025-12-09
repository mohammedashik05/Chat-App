import "./Chat.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "./socket";

function Chat() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const email = localStorage.getItem("UserEmail") || "";
  const chatEndRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL;  // FIXED

  useEffect(() => {
    // 1️⃣ Set socket token BEFORE connect()
    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    // 2️⃣ Load chat history (REST API)
    axios
      .get(`${API}/msg`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        }
      })
      .catch(err => console.error("History load error:", err));

    // 3️⃣ Listen for new messages
    socket.off("chat:message");
    socket.on("chat:message", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("chat:message");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit("chat:message", { text });
    setText("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserEmail");
    navigate("/signin");
  };

  return (
    <div className="main-chat-container">
      <div className="chat-header">
        <h2 className="chat-title">💬 Welcome to Chat Room</h2>
        <div className="user-info">
          <p><strong>User:</strong> {email}</p>
          <button className="chat-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="chat-box chat-messages">
        {Array.isArray(messages) &&
          messages.map(m => (
            <div
              key={m._id}
              className={`message ${m.email === email ? "sender" : "receiver"}`}
            >
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
