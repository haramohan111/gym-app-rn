import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile, fetchUser } from "../../redux/features/auth/authSlice";
import "../../styles/Profile.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userid, setUserId] = useState();

  const storage = getStorage();

  // track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // 🔹 Fetch user profile on mount
  useEffect(() => {
    if (userid) {
      dispatch(fetchUser(userid));
    }
  }, [dispatch, userid]);

  // 🔹 Sync redux user -> local form
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        avatar: user.avatar || "",
      }));
    }
  }, [user]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 handle file upload
// 🔹 handle file upload (Cloudinary)
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "gym-image"); // from Cloudinary
  data.append("cloud_name", "dccleecro");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dccleecro/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const uploadRes = await res.json();
    if (uploadRes.secure_url) {
      setFormData((prev) => ({ ...prev, avatar: uploadRes.secure_url }));
    } else {
      alert("Upload failed ");
      console.error(uploadRes);
    }
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    alert("Failed to upload image ");
  } finally {
    setUploading(false);
  }
};


  // validation function
  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleUpdate = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    dispatch(updateUserProfile(formData));
    alert("Profile updated successfully ");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Top Section */}
        <div className="profile-top">
          <div className="profile-info">
            <img
              src={formData.avatar || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <div>
              <h2>
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="email">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="profile-form">
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>

          <div className="form-row">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>

          <div className="form-row">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-row">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-row">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          {/* 🔹 File Upload */}
          <div className="form-row">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {uploading && <p className="info">Uploading...</p>}
          </div>

          {/* Update Button */}
          <button className="update-btn" onClick={handleUpdate} disabled={uploading}>
            {uploading ? "Uploading..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
