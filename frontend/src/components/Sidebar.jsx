import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="profile-cards">
        <img src="https://via.placeholder.com/60" alt="User" className="profile-img" />
        <h2>Lillie Robbins</h2>
        <p>Member since 04/2021</p>
        {/* <button className="edit-btn">Edit</button> */}
        <div className="member-info">
          {/* <p>Check-in code: <strong>907600</strong></p> */}
          <p>Birthday: Apr 10</p>
          <p>Phone: (310) 429-6546</p>
          <p>Email: lillie@example.com</p>
          <p>Membership: 1 month</p>
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/home">Dashboard</Link>
        <Link to="/billing">Membership</Link>
        <Link to="/profile">Profile</Link>
        <Link to="#">Billing</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
