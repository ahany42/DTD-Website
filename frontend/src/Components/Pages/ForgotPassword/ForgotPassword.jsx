import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Login/Login.css"; // same CSS as Login/SignUp
import { AppContext } from "../../../App";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warn("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Reset link sent to your email!");
        setEmail("");
        // Optional: navigate("/login");
      } else {
        toast.error(data.message || "User not found");
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
          <h2 className="form-title">Forgot Password</h2>

          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="login-form-link forgot-text">
            <span onClick={() => navigate("/login")}>Back to Login</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
