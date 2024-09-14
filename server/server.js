// server.js
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000'
}));


// Initialize Firebase Admin SDK (make sure you have the serviceAccountKy
const serviceAccount = require('./credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


app.use(bodyParser.json()); // To parse JSON bodies

app.post('/api/auth', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    res.json({ message: 'Token verified', uid });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
