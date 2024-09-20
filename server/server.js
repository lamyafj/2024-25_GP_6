// src/server.js
const express = require('express');
const admin = require('./firebaseAdmin'); // Ensure this import path is correct
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const db = admin.firestore();
const UniversalCookie = require('universal-cookie');
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// Middleware to handle cookies
app.use((req, res, next) => {
  const cookies = new UniversalCookie(req.headers.cookie);
  req.cookies = cookies;
  next();
});


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Allow credentials
}));
app.use(bodyParser.json());


////////////////Log in School
// const validateToken = async (req, res, next) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).send('No token provided');
//   }

//   try {
//     // Verify the token with Firebase Admin SDK
//     const decodedToken = await admin.auth().verifyIdToken(token);

//     // Set token as HttpOnly cookie
//     res.cookie('authToken', token, {
//       httpOnly: true,
//       secure: false, // Set to true if using HTTPS
//       maxAge: 3600000,
//       sameSite: 'Strict'
//     });
    
//     // Attach decoded token to request object for further use
//     // Fetch user role from Firestore
//     const userDoc = await db.collection('School').doc(decodedToken.uid).get();
//     if (!userDoc.exists) {
//       return res.status(404).send('User not found');
//     }
//     // Attach user role to the request object
//     const userData = userDoc.data(); // Retrieve the document data
//     const userRole = userData.Role; 
//     console.log(userRole) 
//     if(userRole=='School'){
//       next();
//     } 
//   } catch (err) {
//     console.error('Token verification error:', err);
//     return res.status(401).send('Unauthorized not admin');
//   }
// };

// app.post('/api/auth', validateToken, (req, res) => {
//   res.status(200).send(true); // Respond after successful login
// });






////////////////Sign up School

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
      "Role":"School",
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


///////////verify token and cookie before granting access to dashboaord 
// app.get('/api/verify', async (req, res) => {
//   const token = req.cookies.get('authToken'); // Get the cookie
//   if (!token) {
//     return res.status(401).send({ error: 'Unauthorized' });
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     res.status(200).send({ message: 'Authenticated', user: decodedToken });
//   } catch (error) {
//     res.status(401).send({ error: 'Unauthorized' });
//   }
// });


//////////////////////Routing
app.get('/api/protected-route', async (req, res) => {

  //console.log(req.headers);
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token from the Authorization header

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST!'); // No token provided
  }
  
  try {
    const decodedClaims = admin.auth().verifySessionCookie(idToken, true /** checkRevoked */)// Verify the ID token
    res.status(200).send(true);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

///////////////////////////Login

app.post('/api/sessionLogin', async (req, res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 1000 *60 *24*5 ;// 5 days

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Fetch user document from the database
    const userDoc = await db.collection('School').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    // Attach user role to the request object
    const userData = userDoc.data(); // Retrieve the document data
    const userRole = userData.Role; 
    console.log(userRole);

    if (userRole === 'School') {
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
      res.cookie('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: false, // Set to false for testing (change to true in production)
        secure: false, // Set to true in production
        sameSite: 'Lax', // Adjust as needed
        path: '/' // Ensure it's accessible throughout the site
      });
      return res.status(200).send({ status: 'success' });
    } else {
      return res.status(403).send('Forbidden: User is not a School');
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

////////////////////////LogOut
app.post('/api/logout', (req, res) => {
  res.clearCookie('session');
  console.log('im logout');
  res.status(200).send({ status: 'success' });
});

///////////////////////bring record
app.post('/api/record', async (req, res) => {
  console.log('Server record checker called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    // Verify the ID token (using verifyIdToken instead of verifySessionCookie)
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    console.log('Decoded Claims:', decodedClaims);

    // Fetch user document from Firestore
    const userDoc = await admin.firestore().collection('School').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    // Retrieve user data and send it as the response
    const userData = userDoc.data();
    console.log('User Data:', userData);
    res.status(200).send(userData);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


