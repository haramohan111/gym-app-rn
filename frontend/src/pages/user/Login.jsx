import React from 'react';
import './Login.css'
import { Link } from 'react-router-dom';

const SignupLogin = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Gym Member Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>

          <button type="submit">Login</button>
          <p className="register-link">Don't have an account? <Link to="/signup">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignupLogin;
