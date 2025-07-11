import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Add useNavigate
import '../auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ initialize navigate
  const API = 'http://localhost:7000/api';

  useEffect(() => {
    axios.get(`${API}/user`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log("protected route response", res.data);
      })
      .catch(err => {
        console.log("token auth failed", err.response?.data);
      })
  }, [status]);

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    axios.post(`${API}/signin`, { email, password })
      .then((res) => {
        setStatus(res.data.message);
        setError('');
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("UserEmail",email);

        if (res.data.success) {
          // ✅ Redirect and pass email as state
          navigate('/Chat',);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed");
        setStatus('');
      });
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status && <p style={{ color: 'green' }}>{status}</p>}
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      <p>Forgot password? <Link to="/updatepass">Reset Password</Link></p>
    </div>
  );
};

export default SignIn;
