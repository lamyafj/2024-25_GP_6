// Load environment variables
require('dotenv').config();

// Log to check if environment variables are being loaded correctly
console.log('Private Key ID:', process.env.private_key_id);
console.log('Private Key:', process.env.private_key);

// src/firebaseAdmin.js
const admin = require('firebase-admin');
//const serviceAccount = require('./credentials.json'); // Ensure this path is correct
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


serviceAccount={
  "type": "service_account",
  "project_id": "maslak-d4678",
  "private_key_id":process.env.private_key_id,
  "private_key":process.env.private_key.replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-a566c@maslak-d4678.iam.gserviceaccount.com",
  "client_id": "114911191440068712766",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-a566c%40maslak-d4678.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}



// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


module.exports = admin;

