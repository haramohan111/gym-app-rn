import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Home';
import AddUser from './pages/User/AddUser';
import ManageUsers from './pages/User/ManageUsers';
import AddMusic from './pages/Package/AddMusic';
import ManageMusic from './pages/Package/ManageMusic';
import Home from './components/Home';
import Dashboard1 from './components/Dashboard1';
import AdminLogin from './pages/AdminLogin';
import SignupLogin from './pages/SignupLogin';
import ProtectedRoute from './ProtectedRoute';
import EditUser from './pages/User/EditUser';
import AddPlans from './pages/Package/AddPlans';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin/signup-login" element={<SignupLogin />} />
 <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Home />}>
          <Route path="dashboard" element={<Dashboard1 />} />
          <Route path="user/add-user" element={<AddUser />} />
          <Route path="user/manage-users" element={<ManageUsers />} />
           <Route path="user/edit-user/:uid" element={<EditUser />} />
          <Route path="plans/add-plans" element={<AddPlans />} />
          <Route path="music/manage-music" element={<ManageMusic />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

</Route>
        {/* Optional: 404 page */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}