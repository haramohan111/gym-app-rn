// ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/admin/verify-session', {
      withCredentials: true
    })
    .then(() => setAuthenticated(true))
    .catch(() => setAuthenticated(false))
    .finally(() => setLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;
//console.log('isAuthenticated:', isAuthenticated); // Debugging line
   return isAuthenticated ? <Outlet /> : <Navigate to="/adminlogin" />;
}
