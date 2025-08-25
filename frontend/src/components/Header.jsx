import React from 'react';
import '../styles/Header.css';
import { FiBell, FiLogOut } from 'react-icons/fi';

function Header() {
  return (
    <div className="top-header">
      <div className="header-title">Dashboard</div>
      <div className="header-icons">
        <button className="icon-btn">🔔</button>
        {/* <button className="icon-btn logout">🚪</button>
        <button className="icon-btn"><FiBell size={20} /></button> */}
<button className="icon-btn logout"><FiLogOut size={20} /></button>
      </div>
    </div>
  );
}

export default Header;
