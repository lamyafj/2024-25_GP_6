// src/server.js
const express = require('express');
const admin = require('./firebaseAdmin'); // Ensure this import path is correct
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();



app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());


////////////////Log in School
const validateToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification error:', err); // Log the error
    res.status(401).send('Unauthorized');
  }
};

app.post('/api/auth', validateToken, (req, res) => {
  res.send(true);
});

////////////////Sign up School
const db = admin.firestore();

app.post('/api/auth/register', async (req, res) => {
  const { email, password, schoolCode } = req.body;

  try {
    // Create a new user with Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: schoolCode, // Optional     
    });
    console.log('Successfully created new user:', userRecord.uid);
    // Prepare the data to add to Firestore
    const userData = {
      email,
      schoolCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Add timestamp
    };
    // Add the user data to the 'users' collection in Firestore
    await db.collection('School').doc(userRecord.uid).set(userData);
    res.status(201).send({ message: 'User registered and document created successfully' });

  } catch (error) {
    console.error('Error creating new user:', error.message);
    res.status(500).send({ message: 'Failed to register user', error: error.message });
  }
});







app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


