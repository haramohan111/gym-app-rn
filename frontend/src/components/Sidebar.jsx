import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // adjust path to your firebase config
import { fetchUser } from "../redux/features/auth/authSlice"; // adjust path

function Sidebar() {
  const dispatch = useDispatch();
  const [userid, setUserId] = useState(null);

  // Get user from redux
  const { user, status, error } = useSelector((state) => state.auth);
  const { payments } = useSelector((state) => state.payment);
  // Track Firebase auth state
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

  // Fetch user from backend/DB when userid changes
  useEffect(() => {
    if (userid) {
      dispatch(fetchUser(userid));
    }
  }, [dispatch, userid]);

  // Prepare updated payments with remainingDays
  const updatedPayments = payments.map((payment) => {
    let expireDate = "N/A";
    let remainingDays = 0;

    if (payment.createdAt && payment.duration) {
      const start = payment.createdAt.seconds
        ? new Date(payment.createdAt.seconds * 1000)
        : new Date(payment.createdAt);

      let months = 0;
      if (payment.duration.toLowerCase().includes("month")) {
        months = parseInt(payment.duration);
      } else if (payment.duration.toLowerCase().includes("year")) {
        months = 12;
      }

      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + months);
      expireDate = expiry.toLocaleDateString();

      const today = new Date();
      const diffTime = expiry - today;
      remainingDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    }

    return { ...payment, expireDate, remainingDays };
  });

  // Sum of all remaining days
  const totalRemainingDays = updatedPayments.reduce(
    (acc, curr) => acc + (curr.remainingDays || 0),
    0
  );

  return (
    <aside className="sidebar">
      <div className="profile-cards">
        <img
          src={user?.avatar || "https://via.placeholder.com/60"}
          alt="User"
          className="profile-img"
        />
        <h2>  {user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.name || "Loading..."}</h2>
          {updatedPayments.length > 0 && (<p>Total Remaining Days {totalRemainingDays}</p> )}

        <div className="member-info">
          <p>Birthday: {user?.birthday || "Not set"}</p>
          <p>Phone: {user?.phone || "Not available"}</p>
          <p>Email: {user?.email || "Not available"}</p>
          <p>Membership: {user?.membership || "N/A"}</p>
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/home">Dashboard</Link>
        <Link to="/suppliment">Suppliment</Link>
         <Link to="/diet">Diet</Link>
        <Link to="/supplimentorder">Suppliment Order</Link>
        <Link to="/payment">Payment</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/contact">Contact</Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
