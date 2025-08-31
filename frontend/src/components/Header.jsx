import React from "react";
import "../styles/Header.css";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/features/auth/authSlice";


function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="top-header">
      <div className="header-title">Dashboard</div>
      <div className="header-icons">
        <button className="icon-btn logout" onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default Header;
