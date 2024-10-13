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

//////////////////////////////////add bus
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
      driver:null,
      current_capacity:Number(0),
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
  const { uid } = req.body; // Assuming you are sending bus uid in the request body
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

    // Update any drivers and students that reference this bus
    const driverQuery = db.collection('Driver').where('bus', '==', busRef);
    const studentQuery = db.collection('Student').where('bus', '==', uid);

    const [driverDocs, studentDocs] = await Promise.all([
      driverQuery.get(),
      studentQuery.get()
    ]);

    // Set the bus reference to null for all affected drivers
    const updateDriverPromises = driverDocs.docs.map(doc => doc.ref.update({ bus: null }));
    // Set the bus reference to null for all affected students
    const updateStudentPromises = studentDocs.docs.map(doc => doc.ref.update({ bus: null }));

    // Execute all update promises
    await Promise.all([...updateDriverPromises, ...updateStudentPromises]);

    res.status(200).send({ message: 'Bus deleted and associated records updated successfully' });
  } catch (error) {
    console.error('Error deleting bus or updating records:', error);
    res.status(500).send('Failed to delete bus and update records');
  }
});

//////////////////////////////////bring one bus detail
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
  console.log('Server driver add called');

  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  let {newdriver} = req.body;
  
  if (!idToken) {
    return res.status(403).send('failed');
  }
  
  console.log(newdriver.driverPhone);
  
  const phone = '+966' + newdriver.driverPhone.trim();
  console.log(phone);
  
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid = decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);
    
    const userRecord = await admin.auth().createUser({
      phoneNumber: phone
    });
    
    console.log('Successfully created new driver:', userRecord.uid);
    
    newdriver = { 
      ...newdriver,
      school: schoolRef, 
      bus: null,
      uid: userRecord.uid,
      status: 'active'
    };
    
    // Add new driver to the 'Driver' collection
    await db.collection('Driver').doc(userRecord.uid).set(newdriver);
    
    // Fetch the school document
    const schoolDoc = await admin.firestore().collection('School').doc(schooluid).get();
    const schoolData = schoolDoc.data();
    
    // Update school data with the new driver's UID
    const newschoolDoc = { 
      ...schoolData, // Spread the existing data
      drivers: [...(schoolData.drivers || []), userRecord.uid] // Add the new driver's UID to the drivers array
    };
    
    // Update the school document with the new drivers array
    await db.collection('School').doc(schooluid).set(newschoolDoc);
    
    console.log('Added driver');
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
    const driverUids = userData.drivers; // Get the array of driver UIDs (not references)

    // If there are no driver UIDs, return an empty array
    if (!driverUids || driverUids.length === 0) {
      return res.status(200).send([]); // No drivers found
    }

    // Fetch driver documents from the Driver collection using UIDs
    const driverPromises = driverUids.map(driverUid => 
      db.collection('Driver').doc(driverUid).get() // Get each driver document by UID
    );
    const driverDocs = await Promise.all(driverPromises);

    // Map through the driver documents to return their data
    const drivers = driverDocs
      .filter(driverDoc => driverDoc.exists) // Ensure the document exists
      .map(driverDoc => ({ id: driverDoc.id, ...driverDoc.data() })); // Return driver data with ID
      console.log(drivers)
    res.status(200).send(drivers); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});

////////////////////////////////////////bring one driver detail
app.post('/api/driverdetail', async (req, res) => {
  console.log('Server driver detail called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  const { uid } = req.body; // Expecting uid to be in the request body


  if (!idToken ) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }
  console.log(uid)
  try {
      //لا ينمسح
   // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const driversRef = admin.firestore().collection('Driver'); 
    const driverSnapshot = await driversRef.where('uid', '==', uid).get();

    if (driverSnapshot.empty) {
      return res.status(404).send('driver not found');
    }
  
    const driverData = driverSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))[0];
    res.status(200).send(driverData); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});

/////////////////////////////////assign a bus for driver
app.post('/api/assignbusfordriver', async (req, res) => {
  console.log('Server tessssssssssst assign bus for driver called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; 
  const { driveruid, busuid } = req.body; // Destructure driveruid and busuid

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    // Uncomment and implement if token verification is needed
    // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);

    const busRef = admin.firestore().collection('Bus').doc(busuid);
    const driverRef = admin.firestore().collection('Driver').doc(driveruid);

    // Fetch documents first
    const busDoc = await busRef.get();
    const driverDoc = await driverRef.get();

    // Ensure both bus and driver documents exist before updating
    if (!busDoc.exists || !driverDoc.exists) {
      return res.status(404).send('Bus or Driver not found');
    }

    // Update the driver and bus references in Firestore
    await driverRef.update({ bus: busRef });
    await busRef.update({ driver: driverDoc.data().uid });

    res.status(200).send('Bus assigned successfully');
  } catch (error) {
    console.error('Error during bus assignment:', error);
    res.status(500).send('Server Error: Bus assignment failed.');
  }
});
/////////////////////////////////////////unAssign bus for driver
app.post('/api/UNassignbusfordriver', async (req, res) => {
  console.log('Server unassign bus for driver called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; 
  const { driveruid, busuid } = req.body; // Destructure driveruid and busuid

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    // Uncomment and implement if token verification is needed
    // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
      
    const driverRef = admin.firestore().collection('Driver').doc(driveruid);
    const driverDoc = await driverRef.get();

    // Check if driver document exists
    if (!driverDoc.exists) {
      return res.status(404).send('Driver not found');
    }
   
      console.log('heey')
    if(busuid){
      const busRef = admin.firestore().collection('Bus').doc(busuid);
      await busRef.update({ driver: null });
    }

    await driverRef.update({
       bus: null
    });
    res.status(200).send('driver unassigned successfully');
  } catch (error) {
    console.error('Error during bus unassignment:', error);
    res.status(500).send('Server Error: Bus unassignment failed.');
  }
});
/////////////////////////////edit driver
app.post('/api/editdriver', async (req, res) => {
  console.log('im edit')
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid, formValues } = req.body;

  if (!uid || !formValues) {
    return res.status(400).send('Bus UID and new data are required');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const busRef = db.collection('Driver').doc(uid);
    await busRef.update({
      driverFamilyName: formValues.driverFamilyName,       
      driverFirstName: formValues.driverFirstName, 
      driverId: formValues.driverId,
      driverPhone:formValues.driverPhone,
  
    });

    res.status(200).send({ message: 'Bus updated successfully' });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).send('Failed to update bus');
  }
});
////////////////////////////////inactivate a driver
app.post('/api/inactivatedriver', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).send('Driver UID is required');
  }

  try {
    // Verify the token if necessary (uncomment if needed)
    // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    
    // Reference to the driver document
    const driverRef = db.collection('Driver').doc(uid);
    const driverDoc = await driverRef.get();

    // Check if the driver document exists
    if (!driverDoc.exists) {
      return res.status(404).send('Driver not found');
    }

    // Get the bus reference from the driver document
    const busRef = driverDoc.data().bus;

    // Update the driver's status and clear the bus reference
    await driverRef.update({
      status:'inactive', // Make sure this is the correct field name
      bus: null
    });

    // If there's a bus reference, update the bus document to set driver to null
    if (busRef) { // Check if busRef is truthy (not null or undefined)
      const busDoc = await db.collection('Bus').doc(busRef.id).get(); // Fetch the bus document
      
      if (busDoc.exists) { // Check if the bus document exists
        await busRef.update({ // Correctly reference the bus document
          driver: null
        });
      }
    }

    console.log('Driver inactivated and bus updated successfully');
    res.status(200).send({ message: 'Driver inactivated and bus updated successfully' });
  } catch (error) {
    console.error('Error updating driver and bus:', error);
    res.status(500).send('Failed to update driver and bus');
  }
});


////////////////////////activate a driver
app.post('/api/activatedriver', async (req, res) => {
  console.log('im activate server')
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid} = req.body;

  if (!uid ) {
    return res.status(400).send(' UID  are required');
  }

  try {
    //const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const busRef = db.collection('Driver').doc(uid);
    await busRef.update({
      status:'active',
      bus:null
    });

    res.status(200).send({ message: 'Bus updated successfully' });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).send('Failed to update bus');
  }
});


///////////////////////////////////////bring all students records
app.post('/api/studentsrecord', async (req, res) => {
  console.log('Server student record checker called');
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
    const students = userData.students; // Get the student references

    // If there are no student references, return an empty array
    if (!students || students.length === 0) {
      return res.status(200).send([]); // No students found
    }

    // Create promises to fetch student documents from the Student collection using references
    const studentsPromises = students.map(studentRef => studentRef.get());
    const studentDocs = await Promise.all(studentsPromises);

    // Map student documents to return a more manageable format
    const studentData = studentDocs.map(studentDoc => ({ id: studentDoc.id, ...studentDoc.data() }));

    res.status(200).send(studentData); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});



///////////////////////////////////////add student
app.post('/api/addstudent', async (req, res) => {
  console.log('Server add called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  let { newstudent } = req.body;
  
  if (!idToken) {
    return res.status(403).send('failed');
  }  

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid = decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);
    const parent_uid = '+966' + newstudent.parent_phone.trim();

    newstudent = { 
      ...newstudent,
      parent_uid: parent_uid,
      school: schoolRef, 
      status: 'active', // Set status to active
      bus:null,
    };
    
    const newstudentRef = await db.collection('Student').add(newstudent);
    const newstudentUID = newstudentRef.id;

    await db.collection('Student').doc(newstudentUID).update({ uid: newstudentUID });
    
    const schoolDoc = await admin.firestore().collection('School').doc(schooluid).get();
    const schoolData = schoolDoc.data();

    const newschoolDoc = { 
      ...schoolData, // Spread the existing data
      students: [...(schoolData.students || []), newstudentRef], // Add the new student reference to the students array
    };

    await db.collection('School').doc(schooluid).set(newschoolDoc); 

    console.log('added student');
    res.status(200).send(true);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});

///////////////////////////////////bring student detail
app.post('/api/studentdetail', async (req, res) => {
  console.log('Server student detail called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  const { uid } = req.body; // Expecting uid to be in the request body

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }
  
  
  try {
    // Token verification can be uncommented if needed
    // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const studentsRef = admin.firestore().collection('Student'); // Change collection name if necessary
    const studentSnapshot = await studentsRef.where('uid', '==', uid).get();

    if (studentSnapshot.empty) {
      return res.status(404).send('Student not found');
    }

    const studentData = studentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    res.status(200).send(studentData); 
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});


/////////////////////////////////////assign a bus for student
app.post('/api/assignstudentbus', async (req, res) => {
  console.log('Server assign bus for student called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; 
  const { studentuid, busuid } = req.body; 

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    // Uncomment and implement if token verification is needed
    // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);

    const busRef = admin.firestore().collection('Bus').doc(busuid);
    const studentRef = admin.firestore().collection('Student').doc(studentuid);

    // Fetch documents first
    const busDoc = await busRef.get();
    const studentDoc = await studentRef.get();

    // Ensure both bus and student documents exist before updating
    if (!busDoc.exists || !studentDoc.exists) {
      return res.status(404).send('Bus or Student not found');
    }

    // Update the student and bus references in Firestore
    await studentRef.update({ bus: busuid });  // Use studentRef (the document reference) to update
    const busData = busDoc.data();
    // Add the student to the students array in the bus document
    const newcapacity=Number(busData.current_capacity)+1;
    console.log(newcapacity)
    await busRef.update({
      students: admin.firestore.FieldValue.arrayUnion(studentuid),  // Add new student to the array
      current_capacity:Number(newcapacity)
    });

    res.status(200).send('Bus assigned successfully');
  } catch (error) {
    console.error('Error during bus assignment:', error);
    res.status(500).send('Server Error: Bus assignment failed.');
  }
});


/////////////////////////////////////////unassign bus for student
app.post('/api/unassignstudentbus', async (req, res) => {
  console.log('Server unassign bus for student called');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; 
  const { studentuid, busuid } = req.body; // Destructure driveruid and busuid

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    // Uncomment and implement if token verification is needed
    // const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
      
    const studentRef = admin.firestore().collection('Student').doc(studentuid);
   
    const studentDoc = await studentRef.get();
   
    console.log('hi')
    // Check if driver document exists
    if (!studentDoc.exists) {
      return res.status(404).send('Driver not found');
    }
     
    const busRef = admin.firestore().collection('Bus').doc(busuid);
    const busDoc = await busRef.get();
    const busData = busDoc.data();
    const newcapacity=Number(busData.current_capacity)-1; 

    await busRef.update({
      students: admin.firestore.FieldValue.arrayRemove(studentuid),
      current_capacity:Number(newcapacity)
    });
    
 

    await studentRef.update({ bus: null });

    res.status(200).send('Bus unassigned successfully');
  } catch (error) {
    console.error('Error during bus unassignment:', error);
    res.status(500).send('Server Error: Bus unassignment failed.');
  }
});

/////////////////////////////edit student details
app.post('/api/editstudent', async (req, res) => {
  console.log('Editing student');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid, formValues } = req.body;

  if (!uid || !formValues) {
    return res.status(400).send('Student UID and new data are required');
  }
  console.log(formValues)
  console.log(uid)

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const studentRef = db.collection('Student').doc(uid);
    await studentRef.update({
      student_id: formValues.student_id,
      student_first_name: formValues.student_first_name,
      student_family_name: formValues.student_family_name,
      city: formValues.city,
      street: formValues.street,         // Added attribute for street
      postal_code: formValues.postal_code,  // Added attribute for postal code
      district: formValues.district,     // Added attribute for district
      //parent_phone: formValues.parent_phone
    });

    res.status(200).send({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Failed to update student');
  }
});

//////////////////////////////////////////reject or delete a student

app.post('/api/deletestudent', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid } = req.body; // UID of the student to delete

  if (!uid) {
    return res.status(400).send('Student UID is required');
  }

  try {
    // Verify the session token
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schoolRef = db.collection('School').doc(decodedClaims.uid);
    const studentRef = db.collection('Student').doc(uid);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).send('Student not found');
    }
    
    const studentData = studentDoc.data();
    const busuid = studentData.bus; 

    await schoolRef.update({
      students: admin.firestore.FieldValue.arrayRemove(uid),
    });
    // If there's a bus reference, update the bus document
    if (busuid) {
      const busRef = admin.firestore().collection('Bus').doc(busuid);
      const busDoc = await busRef.get();
      const busData = busDoc.data();
      const newcapacity=Number(busData.current_capacity)-1; 
  
      await busRef.update({
        students: admin.firestore.FieldValue.arrayRemove(uid),
        current_capacity:Number(newcapacity)
      });
      
   
      
    }
    await studentRef.delete();
    console.log('Student deleted and bus updated successfully');
    res.status(200).send({ message: 'Student deleted and bus updated successfully' });
  } catch (error) {
    console.error('Error deleting student and updating bus:', error);
    res.status(500).send('Failed to delete student and update bus');
  }
});

///////////////////////////////////////////accept a student
app.post('/api/acceptstudent', async (req, res) => {
  console.log('im activate server')
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { uid} = req.body;

  if (!uid ) {
    return res.status(400).send(' UID  are required');
  }

  try {
    //const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const busRef = db.collection('Student').doc(uid);
    await busRef.update({
      status:'active',
      bus:null
    });

    res.status(200).send({ message: 'Bus updated successfully' });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).send('Failed to update bus');
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


