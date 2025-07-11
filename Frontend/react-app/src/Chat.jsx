import './Chat.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Chat() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState([]);
  const email = localStorage.getItem('UserEmail') || '';
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!text.trim() || !email) return;

    try {
      await axios.post('http://localhost:7000/msg/add', { text, email });
      setText('');
      handleGet();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGet = async () => {
    try {
      const res = await axios.get('http://localhost:7000/msg');
      setMessage(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/SignIn';
  };

  useEffect(() => {
    handleGet();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <div className="main-chat-container">
      <h1 className="chat-title">
        🚀 <span>Chat App </span>
      </h1>
      <p className="chat-welcome">Welcome, <strong>{email}</strong></p>
      <button className="chat-Logout" onClick={handleLogout}>Logout</button>

      <div className="chat-box chat-messages">
        {message.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.email === email ? 'sender' : 'receiver'}`}
          >
            <strong>{msg.email === email ? 'You' : msg.email}</strong>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-field">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
