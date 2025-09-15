const express = require('express');
const router = express.Router();
const {
  adminLogin,
  verifySession,
  adminLogout,
  addMember,
  getAllFirebaseUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const {
  verifyFirebaseToken,
  checkAdminAuth
} = require('../middleware/authMiddleware');

// Login
router.post('/adminlogin', verifyFirebaseToken, adminLogin);

// Verify session
router.get('/admin/verify-session', checkAdminAuth, verifySession);

// Logout
router.post('/admin/logout', adminLogout);

// Add member
router.post('/add-member', addMember);

router.get('/get-users', checkAdminAuth, getAllFirebaseUsers);
router.get('/user/:uid',checkAdminAuth, getUserById);
router.put('/user/:uid', updateUser);
router.delete('/delete-user/:uid', deleteUser);

module.exports = router;
