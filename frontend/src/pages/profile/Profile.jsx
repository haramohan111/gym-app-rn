import React from "react";
import "../../styles/Profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Top Section */}
        <div className="profile-top">
          <div className="profile-info">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="profile-avatar"
            />
            <div>
              <h2>Alexa Rowles</h2>
              <p className="email">alexarowles@gmail.com</p>
            </div>
          </div>
          <button className="edit-btn">Edit</button>
        </div>

        {/* Form Fields */}
        <div className="profile-form">
          <div className="form-row">
            <input type="text" placeholder="Full Name" />
            <input type="text" placeholder="Nick Name" />
          </div>
          <div className="form-row">
            <select>
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select>
              <option>Country</option>
              <option>USA</option>
              <option>India</option>
            </select>
          </div>
          <div className="form-row">
            <select>
              <option>Language</option>
              <option>English</option>
              <option>Spanish</option>
            </select>
            <select>
              <option>Time Zone</option>
              <option>GMT</option>
              <option>EST</option>
            </select>
          </div>
        </div>

        {/* Email Section */}
        <div className="email-section">
          <h4>My Email Address</h4>
          <div className="email-item">
            <input type="radio" name="email" defaultChecked />
            <div>
              <p>alexarowles@gmail.com</p>
              <small>1 month ago</small>
            </div>
          </div>
          <button className="add-email-btn">+ Add Email Address</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
