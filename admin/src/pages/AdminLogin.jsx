// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../redux/features/auth/authSlice'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css'; // Import your CSS file for styling
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useEffect } from 'react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { status, error } = useSelector((state) => state.auth);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const result = await dispatch(loginAdmin({ email, password }));
    
  //   if (loginAdmin.fulfilled.match(result)) {
  //     navigate('/admin/dashboard'); // Redirect on success
  //   }
  // };

//   useEffect(() => {
//   const checkLogin = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       const token = await user.getIdToken();
//       const res = await axios.post('http://localhost:5000/adminlogin', {}, {
//         headers: { Authorization: `Bearer ${token}` },
//          withCredentials: true,
//       });
//       if (res.status === 200) navigate('/admin/dashboard');
//     }
//   };

//   checkLogin();
// }, []);



// const handleSubmit = async (e) => {
//   try {
//     e.preventDefault();
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const idToken = await userCredential.user.getIdToken();

//     alert('Login successful');

//     const res = await axios.post('http://localhost:5000/verify', {}, {
//       headers: { Authorization: `Bearer ${idToken}` }
//     });

//     if (res.status === 200) {
//       navigate('/admin/dashboard'); // ✅ Redirect here after successful verification
//     } else {
//       alert('Verification failed');
//     }

//   } catch (err) {
//     alert(err.message);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken(); // Get Firebase ID token
console.log('ID Token:', idToken); // Debugging line
    // Send to backend to verify and set cookie
    await axios.post('http://localhost:5000/api/v1/adminlogin', {}, {
      headers: { Authorization: `Bearer ${idToken}` },
      withCredentials: true, // Important!
    });

    alert('Login success');
    navigate('/admin/dashboard');
  } catch (error) {
    alert(error.message);
  }
};


  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Gym Admin</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;