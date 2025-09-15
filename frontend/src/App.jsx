import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';

import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/profile/Profile';
import Home from './components/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Billing from './pages/Billing/Billing';

import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Payment from './pages/Billing/Payment';
import Contact from './components/Contact';
import SupplementStore from './components/Suppliments';
import SupplementOrders from './components/SupplementOrder';
import DietDetails from './components/DietDetails';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  This keeps user logged in even after refresh
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
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Home />} >

              <Route path="home" element={<Dashboard />} />
               <Route path="/suppliment" element={<SupplementStore/>}/>
               <Route path="/diet" element={<DietDetails/>}/>
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/payment" element={<Payment/>}/>
              <Route path="/supplimentorder" element={<SupplementOrders/>}/>
               <Route path="/contact" element={<Contact/>}/>

            </Route>
          </Route>
          {/* Optional: 404 page */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
