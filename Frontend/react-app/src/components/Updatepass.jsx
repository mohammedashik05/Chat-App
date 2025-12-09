import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../auth.css";
import toast from "react-hot-toast";

const Updatepass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [userId, setUserId] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  // 🔹 Step 1: Verify user before password reset
  const verifyUser = async () => {
    if (!email || !currentPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/verify`, {
        email,
        password: currentPassword,
      });

      if (res.data.success) {
        setUserId(res.data.id);
        setVerified(true);
        toast.success("User verified. You can reset your password now.");
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (err) {
      toast.error("Error verifying user");
    }
  };

  // 🔹 Step 2: Update password
  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.put(`${API}/api/reset/${userId}`, {
        password: newPassword,
      });

      if (res.data.success) {
        toast.success("Password updated successfully!");

        // Reset state
        setEmail("");
        setCurrentPassword("");
        setNewPassword("");
        setVerified(false);

        // Redirect to Signin
        setTimeout(() => navigate("/signin"), 1200);
      } else {
        toast.error(res.data.message || "Password update failed");
      }
    } catch (err) {
      toast.error("Error updating password");
    }
  };

  return (
    <div className="auth-page-wrapper">
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
            <button onClick={() => navigate("/signin")}>Cancel</button>
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
      </div>
    </div>
  );
};

export default Updatepass;
