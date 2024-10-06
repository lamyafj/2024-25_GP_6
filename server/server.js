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
const { FieldValue } = require('firebase-admin').firestore;
const translate = require('@vitalets/google-translate-api');
const fetch = require('node-fetch');
//const GeoFire = require('geofire');


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


const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; 

  if (!idToken) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifySessionCookie(idToken, true);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send('Invalid token');
  }
};



// Create a GeoFire reference
//const firebaseRef = admin.database().ref('geofire'); // Adjust this path as needed
//const geoFire = new GeoFire(firebaseRef);




//////////////////////Sign up School

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
    //////////////////set up the data attributes
    //////////////Geo exapmple
      const lat = 51.5074;
      const lng = 0.1278;
      //const hash = geoFire.geohashForLocation([lat, lng]);;
    const userData = {
      email,
      schoolCode,
      Role:"School",
      buses:[],
      students:[],
      drivers:[],
      coordinates: new admin.firestore.GeoPoint(Number(lat), Number(lng)),
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

    //////only sign in if the account is School account
    const userData = userDoc.data(); 
    const userRole = userData.Role; 


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

//////////////////////////////LogOut
app.post('/api/logout', (req, res) => {
  res.clearCookie('session');
  res.status(200).send({ status: 'success' });
});

///////////////////////bring School record
app.post('/api/record', async (req, res) => {
  console.log('Server record checker called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; 

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {

    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const userDoc = await admin.firestore().collection('School').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();
    res.status(200).send(userData);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});

///////////////////////// add bus
app.post('/api/addbus', async (req, res) => {
  console.log('Server add  called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  let {newbus} =req.body;
  if (!idToken ) {
    return res.status(403).send('failed');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid =decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);
    newbus = { 
      ...newbus,
      school: schoolRef, 
      students:[],
      driver:'',
      testid:'',
    };
    const newBusRef = await db.collection('Bus').add(newbus); 
    //add uid ti the bus attributes
    const newBusUID = newBusRef.id;
    await db.collection('Bus').doc(newBusUID).update({ uid: newBusUID });
    const schoolDoc = await admin.firestore().collection('School').doc(schooluid).get();
    const schoolData = schoolDoc.data();
    const newschoolDoc = { 
      ...schoolData, // Spread the existing data
      buses: [...(schoolData.buses || []), newBusRef], // Add the new bus ID to the buses array
    };
    const length = newschoolDoc.buses.length
    const busId = length
    await db.collection('School').doc(schooluid).set(newschoolDoc); 
    await db.collection('Bus').doc(newBusUID).update({ id: busId });   
    console.log('added bus');
    res.status(200).send(true);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});

//////////////////////////bus record
app.post('/api/busrecord', async (req, res) => {
  console.log('Server bus record checker called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const userDoc = await admin.firestore().collection('School').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();
    const busRefs = userData.buses; // Get the bus references

    // If there are no bus references, return an empty array
    if (!busRefs || busRefs.length === 0) {
      return res.status(200).send([]); // No buses found
    }

    // Fetch bus documents from the Bus collection using references
    const busPromises = busRefs.map(busRef => busRef.get());
    const busDocs = await Promise.all(busPromises);

    const buses = busDocs.map(busDoc => ({ id: busDoc.id, ...busDoc.data() }));

    res.status(200).send(buses); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});


//////////////////////////////////Delete a bus
app.post('/api/deletebus', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  const { uid } = req.body; // Assuming you are sending busuid in the request body
  if (!uid) {
    return res.status(400).send('Bus UID is required');
  }

  try {
    // Verify the session token
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid = decodedClaims.uid;

    const schoolRef = db.collection('School').doc(schooluid);
    const busRef = db.collection('Bus').doc(uid);

    // Delete the bus document
    await busRef.delete();

    // Remove the bus reference from the school's buses array
    await schoolRef.update({
      buses: admin.firestore.FieldValue.arrayRemove(busRef)
    });

    // Fetch the updated list of bus references
    const schoolDoc = await schoolRef.get();
    const schoolData = schoolDoc.data();

    if (schoolData.buses && schoolData.buses.length > 0) {
      // Fetch all remaining bus documents
      const busPromises = schoolData.buses.map((busRef) => busRef.get());
      const busDocs = await Promise.all(busPromises);

      // Update the testid of each bus based on their new position
      const updatePromises = busDocs.map((busDoc, index) => {
        if (busDoc.exists) {
          return busDoc.ref.update({ id: index + 1 });
        }
        return null;
      });

      await Promise.all(updatePromises);
    }

    res.status(200).send({ message: 'Bus deleted and testid updated successfully' });
  } catch (error) {
    console.error('Error deleting bus or updating testid:', error);
    res.status(500).send('Failed to delete bus and update testid');
  }
});


///////////////////////////////////bring one bus detail
app.post('/api/busdetail', async (req, res) => {
  console.log('Server bus detail called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  const { uid } = req.body; // Expecting uid to be in the request body

  if (!idToken ) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }
  console.log(uid)
  try {
      //لا ينمسح
   // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const busesRef = admin.firestore().collection('Bus'); 
    const busSnapshot = await busesRef.where('uid', '==', uid).get();

    if (busSnapshot.empty) {
      return res.status(404).send('Bus not found');
    }
  
    const busData = busSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))[0];
    res.status(200).send(busData); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});
//////////////////////////////////edit bus detail
app.post('/api/editbus', async (req, res) => {
  console.log('im edit')
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid, newbus } = req.body;

  if (!uid || !newbus) {
    return res.status(400).send('Bus UID and new data are required');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const busRef = db.collection('Bus').doc(uid);
    await busRef.update({
      name: newbus.name,       
      plate: newbus.plate, 
      capacity: newbus.capacity,
      //rfid:newbus.rfid,
    });

    res.status(200).send({ message: 'Bus updated successfully' });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).send('Failed to update bus');
  }
});
/////////////////////////////////add new driver
app.post('/api/adddriver', async (req, res) => {
  console.log('Server driver add  called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  let {newdriver} =req.body;
  if (!idToken ) {
    return res.status(403).send('failed');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid =decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);
    newdriver = { 
      ...newdriver,
      school: schoolRef, 
      bus:null,
    };
    const newDriverRef = await db.collection('Driver').add(newdriver); 
    //add uid ti the bus attributes
    const newDriverUID = newDriverRef.id;
    await db.collection('Driver').doc(newDriverUID).update({ uid: newDriverUID });
    const schoolDoc = await admin.firestore().collection('School').doc(schooluid).get();
    const schoolData = schoolDoc.data();
    const newschoolDoc = { 
      ...schoolData, // Spread the existing data
      drivers: [...(schoolData.drivers || []), newDriverRef], // Add the new bus ID to the buses array
    };
    // const length = newschoolDoc.buses.length
    // const busId = length
    await db.collection('School').doc(schooluid).set(newschoolDoc); 
    // await db.collection('Bus').doc(newBusUID).update({ id: busId });   
    console.log('added driver');
    res.status(200).send(true);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});
////////////////////////////////////bring all driver
app.post('/api/driverecord', async (req, res) => {
  console.log('Server drivers record checker called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const userDoc = await admin.firestore().collection('School').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();
    const driverRefs = userData.drivers; // Get the bus references

    // If there are no bus references, return an empty array
    if (!driverRefs || driverRefs.length === 0) {
      return res.status(200).send([]); // No buses found
    }

    // Fetch bus documents from the Bus collection using references
    const driverPromises = driverRefs.map(driverRef => driverRef.get());
    const driverDocs = await Promise.all(driverPromises);

    const drivers = driverDocs.map(driverDoc => ({ id: driverDoc.id, ...driverDoc.data() }));

    res.status(200).send(drivers); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});





// app.post('/api/translate-countries', async (req, res) => {
//   console.log('h')
//   try {
//     // Fetch country names from the REST Countries API
//     const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
//     const data = await response.json();

//     // Extract country names
//     const countryNames = data.map(country => country.name.common);
//     res.json(countryNames);
//   } catch (error) {
//     console.error('Error fetching or translating countries:', error);
//     res.status(500).json({ error: 'Error fetching or translating countries' });
//   }
// });






app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


