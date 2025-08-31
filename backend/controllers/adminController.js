const admin = require('../utility/firebaseAdmin');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Admin login
const adminLogin = (req, res) => {
  const { uid } = req.user;

  res.cookie('admin_session', uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: 'Login successful' });
};

// Check session
const verifySession = (req, res) => {
  res.json({ loggedIn: true, uid: req.uid });
};

// Logout
const adminLogout = (req, res) => {
  res.clearCookie('admin_session');
  res.status(200).json({ message: 'Logged out' });
};

// Add member
const addMember = async (req, res) => {
  console.log('Adding member:', req.body);
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if email already exists
    try {
      await admin.auth().getUserByEmail(email);
      return res.status(409).json({ success: false, message: 'Email already exists' });
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        return res.status(500).json({ success: false, message: 'Error checking email', error: err.message });
      }
      // If user not found, continue to create
    }

    // Create new user
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { role });

    // Convert UTC to IST
    const utcNow = new Date();
    const istOffset = 5.5 * 60; // IST is UTC+5:30 in minutes
    const istDate = new Date(utcNow.getTime() + istOffset * 60000);

    // Store user data in Firestore
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      firstName,
      lastName,
      email,
      role,
      createdAt: istDate,
    });

    res.status(200).json({ success: true, message: 'User created', uid: user.uid });
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(400).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};



// GET all Firebase users
const getAllFirebaseUsers = async (req, res) => {
  try {
    const users = [];
    const authResult = await admin.auth().listUsers(1000);

    for (const userRecord of authResult.users) {
      const uid = userRecord.uid;

      // Try to fetch Firestore profile
      const userDoc = await db.collection('users').doc(uid).get();
      const firestoreData = userDoc.exists ? userDoc.data() : {};

      users.push({
        uid: uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: userRecord.customClaims?.role || firestoreData.role || 'User',
        disabled: userRecord.disabled,
        lastLogin: userRecord.metadata.lastSignInTime || null,
        firstName: firestoreData.firstName || '',
        lastName: firestoreData.lastName || '',
        createdAt: firestoreData.createdAt || null
      });
    }

    users.forEach(user => {
      console.log({
        uid: user.uid,
        createdAt: user.createdAt,
        type: typeof user.createdAt,
        toDate: user.createdAt?.toDate?.(),
        getTime: user.createdAt?.toDate?.()?.getTime?.()
      });
    });



    const sortedUsers = users.slice().sort((a, b) => {
      const getTime = obj => {
        try {
          return obj?.createdAt?.toDate?.()?.getTime?.() ?? 0;
        } catch {
          return 0;
        }
      };

      return getTime(a) - getTime(b); // ascending
    });





    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error('Error fetching Firebase users with Firestore data:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};



// GET /api/v1/user/:uid
const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    // Get Firebase Auth user
    const userRecord = await admin.auth().getUser(uid);

    // Get Firestore profile
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || userRecord.customClaims?.role || 'user',
      permissions: userData.permissions || []
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(404).json({ message: 'User not found', error });
  }
};

const updateUser = async (req, res) => {
  const { uid } = req.params;
  const {
    firstName,
    lastName,
    email,
    role,
    password,
    permissions
  } = req.body;

  try {
    // Update Auth profile
    const authUpdate = {
      email,
      displayName: `${firstName} ${lastName}`,
    };

    if (password && password.length >= 8) {
      authUpdate.password = password;
    }

    await admin.auth().updateUser(uid, authUpdate);

    // Update Firestore document
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      firstName,
      lastName,
      role,
      permissions
    });

    res.status(200).json({ message: 'User updated in both Firebase Auth and Firestore' });
  } catch (error) {
    console.error('Dual update failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  adminLogin,
  verifySession,
  adminLogout,
  addMember,
  getAllFirebaseUsers,
  getUserById,
  updateUser
};
