// src/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json'); // Ensure this path is correct
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


module.exports = admin;

