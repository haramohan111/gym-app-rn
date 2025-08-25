import React from 'react';
import './signup.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Gym Account</h2>
        <form>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name" required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" required />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Re-enter password" required />
          </div>

          <button type="submit">Register</button>
          <p className="login-link">Already have an account? <Link to="/">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
