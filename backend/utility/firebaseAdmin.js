// firebaseAdmin.js
const admin = require('firebase-admin');

const serviceAccount = require('../firebaseServiceKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gym-project-476ea-default-rtdb.firebaseio.com'
  });
}

module.exports = admin;
