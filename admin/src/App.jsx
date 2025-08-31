import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Home';
import AddUser from './pages/User/AddUser';
import ManageUsers from './pages/User/ManageUsers';
import AddPlans from './pages/Package/AddPlans';
import ManagePlans from './pages/Package/ManagePlans';
import Home from './components/Home';
import Dashboard1 from './components/Dashboard1';
import AdminLogin from './pages/AdminLogin';
import SignupLogin from './pages/SignupLogin';
// import ProtectedRoute from './ProtectedRoute';

import EditUser from './pages/User/EditUser';

import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import './styles/Pagination.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This keeps user logged in even after refresh
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is logged in:", currentUser.uid);
        setUser(currentUser);
        setLoading(false);
      } else {
        console.log("No user is logged in");
        setLoading(false);
        setUser(null);
        
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);


  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in ", user.uid);
    } else {
      console.log("No user logged in ");
    }
  });
  if (loading) {
    return <Loader />; // Branded splash screen
  }

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <Routes>
        <Route
          path="/adminlogin"
          element={user ? <Navigate to="/admin" replace /> : <AdminLogin />}
        />
        <Route path="/admin/signup-login" element={<SignupLogin />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/admin" element={<Home />}>
            <Route path="dashboard" element={<Dashboard1 />} />
            <Route path="user/add-user" element={<AddUser />} />
            <Route path="user/manage-users" element={<ManageUsers />} />
            <Route path="user/edit-user/:uid" element={<EditUser />} />
            <Route path="plans/add-plans" element={<AddPlans />} />
            <Route path="plans/manage-plans" element={<ManagePlans />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

        </Route>
        {/* Optional: 404 page */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
    </>
  );
}