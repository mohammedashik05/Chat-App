import { useState } from "react";
import axios from "axios";
import "../auth.css";

const Updatepass = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:7000/api";

  const verifyUser = async () => {
    if (!email || !currentPassword) {
      setError("Please fill in both email and current password");
      setMessage("");
      return;
    }

    try {
      const res = await axios.post(`${API}/verify`, {
        email,
        password: currentPassword,
      });

      if (res.data.success) {
        setUserId(res.data.id);
        setVerified(true);
        setError("");
        setMessage("User verified. You can now reset your password.");
      } else {
        setError(res.data.message || "Verification failed");
        setMessage("");
      }
    } catch (err) {
      setError("Error verifying user");
      setMessage("");
    }
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setMessage("");
      return;
    }

    try {
      const res = await axios.put(`${API}/reset/${userId}`, {
        password: newPassword,
      });

      if (res.data.success) {
        setMessage(res.data.message || "Password updated successfully!");
        setError("");
        setVerified(false);
        setEmail("");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setError(res.data.message || "Password update failed");
        setMessage("");
      }
    } catch (err) {
      setError("Error updating password");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      {!verified ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button onClick={verifyUser}>Verify</button>
        </>
      ) : (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={updatePassword}>Update Password</button>
        </>
      )}

      {message && <p className="status">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Updatepass;
