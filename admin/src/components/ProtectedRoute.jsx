import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ user }) {
  if (user === null) {
    // 👇 If no user, redirect to login
    return <Navigate to="/adminlogin" replace />;
  }

  // 👇 If user exists, allow access
  return <Outlet />;
}
