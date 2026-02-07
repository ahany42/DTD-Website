import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../Login/Login.css"; // same styling
import { AppContext } from "../../../App";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { BACKEND_URL } = useContext(AppContext);
  const navigate = useNavigate();
  const { token } = useParams(); // get token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.warn("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(data.message || "Invalid or expired token");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">Reset Password</h2>

          <div className="login-field">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="login-field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="login-form-link forgot-text">
            <span onClick={() => navigate("/login")}>Back to Login</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
