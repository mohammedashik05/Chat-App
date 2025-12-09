import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../auth.css';
import toast from "react-hot-toast";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSignUp = () => {
    if (!email || !password) {
      toast.error("Both fields are required");
      return;
    }

    axios.post(`${API}/api/signup`, { email, password })
      .then((res) => {
        toast.success(res.data.message);
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Sign up failed");
      });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Register</h2>

        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />

        <button onClick={handleSignUp}>Sign Up</button>

        <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
