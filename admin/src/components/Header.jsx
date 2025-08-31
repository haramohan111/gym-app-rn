import React, { useState } from 'react';
import '../styles/Header.css'; // Create this CSS file
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from "../../firebase";

export const Header = () => {
    const [hoveredUserMenu, setHoveredUserMenu] = useState(false);
    const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(getAuth());
//       navigate('/adminlogin');
//     } catch (err) {
//       console.error(err);
//     }
//   };

const handleLogout = async () => {
signOut(auth);
};


    return (
        <header className="topbar">
            <div className="topbar-content">
                {/* Left side content (logo or app name) can go here */}
                <div className="app-name">Gym Admin Panel</div>
                
                {/* Right-aligned user area */}
                <div 
                    className="user-area"
                    onMouseEnter={() => setHoveredUserMenu(true)}
                    onMouseLeave={() => setHoveredUserMenu(false)}
                >
                    <div className="user-info">
                        <span className="user-name">Admin User</span>
                        <div className="user-avatar">👤</div>
                    </div>

                    {hoveredUserMenu && (
                        <div className="user-dropdown">
                            <div className="dropdown-header">Admin Actions</div>
                            <button onClick={() => console.log('Add User clicked')}>
                                <span className="icon">➕</span> Add User
                            </button>
                            <button onClick={() => console.log('Manage Users clicked')}>
                                <span className="icon">🛠️</span> Manage Users
                            </button>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="logout-btn">
                                <span className="icon">🚪</span> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};