import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';
import toast from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSignIn = () => {
    if (!email || !password) {
      toast.error("Both fields are required");
      return;
    }

    axios.post(`${API}/api/signin`, { email, password })
      .then((res) => {
        toast.success(res.data.message);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("UserEmail", email);

        navigate('/Chat');
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Login</h2>

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

        <button onClick={handleSignIn}>Sign In</button>

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p>Forgot password? <Link to="/updatepass">Reset Password</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
