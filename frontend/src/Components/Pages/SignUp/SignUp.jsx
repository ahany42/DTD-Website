import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Login/Login.css";
import { AppContext } from "../../../App";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmPassword || !password || !name || !email) {
      toast.warn("Please Fill All Fields");
      return;
    } else if (confirmPassword !== password) {
      toast.warn("Passwords Does Not Match");
      return;
    } else {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();

        if (!res.ok) {
          return toast.error(data.message || "Wrong email or password");
        }

        localStorage.setItem("DTD_token", data.token);
        localStorage.setItem("DTD_user", data.user);
        toast.success(`Welcome back ${data.user.name}`);

        navigate("/");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
      if (!confirmPassword || !password || !name || !email) {
        toast.warn("Please Fill All Fields");
        return;
      }
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">Sign Up</h2>

          <div className="login-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
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

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="login-field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
          <div className="login-form-link forgot-text">
            <span onClick={() => navigate("/forgot-password")}>
              Forgot Password
            </span>
            <span onClick={() => navigate("/login")}>Log in</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
