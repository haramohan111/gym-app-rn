import React, { useState, useEffect } from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  // Standard error handling
  useEffect(() => {
    if (status === "succeeded" && user) {
      toast.success("Registered successfully!",{closeButton: false});
    } else if (status === "failed") {
      let message = "Something went wrong. Please try again.";

      if (error?.toLowerCase().includes("email")) {
        message = "Email already exists.";
      } else if (error?.toLowerCase().includes("password")) {
        message = "Password must be at least 6 characters.";
      } else if (error?.toLowerCase().includes("network")) {
        message = "Network error. Please check your internet connection.";
      }

      toast.error(message);
    }
  }, [status, error, user]);

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Gym Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Registering..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
