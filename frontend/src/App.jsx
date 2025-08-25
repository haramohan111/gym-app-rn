import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'

import './App.css'
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';

import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/profile/Profile';
import Home from './components/Home';
import Dashboard from './pages/dashboard/dashboard';
import Billing from './pages/Billing/Billing';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} >

          <Route path="home" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/billing" element={<Billing />} />

        </Route>
        {/* Optional: 404 page */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
