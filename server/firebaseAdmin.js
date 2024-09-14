// server/firebaseAdmin.js
const admin = require('firebase-admin');

const serviceAccount = require('./credentials.json'); // Download the service account key from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
