// SignUp.jsx
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../auth.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const API = 'http://localhost:7000/api';

  const handleSignUp = () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    axios.post(`${API}/signup`, { email, password })
      .then((res) => {
        setStatus(res.data.message);
        setError('');
        alert(res.data.message);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Sign up failed");
        setStatus('');
      });
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status && <p style={{ color: 'green' }}>{status}</p>}
      <p>Already have an account? <Link to="/signin">Sign In</Link></p>
    </div>
  );
};

export default SignUp;

