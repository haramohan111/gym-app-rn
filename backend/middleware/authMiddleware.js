const admin = require('firebase-admin');

// Verify token from Authorization header
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Check session cookie
const checkAdminAuth = (req, res, next) => {
  const session = req.cookies.admin_session;
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  req.uid = session;
  next();
};

module.exports = {
  verifyFirebaseToken,
  checkAdminAuth
};
