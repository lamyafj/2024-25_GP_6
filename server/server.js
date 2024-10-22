// src/server.js
const express = require('express');
const admin = require('./firebaseAdmin'); // Ensure this import path is correct
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = express.Router();
const db = admin.firestore();
const UniversalCookie = require('universal-cookie');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { FieldValue } = require('firebase-admin').firestore;
const translate = require('@vitalets/google-translate-api');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
require('dotenv').config()
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
  const { email, password, schoolName, phoneNumber, district, street, city, postalCode } = req.body;
  const lat = 51.5074;
  const lng = 0.1278;

  try {
    // Retrieve school count and generate school code
    const schoolsSnapshot = await admin.firestore().collection('School').get();
    const schoolCount = schoolsSnapshot.size;
    const schoolCode = `SH${String(schoolCount + 1).padStart(2, '0')}`;

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      uid:schoolCode,
      email,
      password,
      displayName: schoolCode,
    });

    // Prepare user data for Firestore
    const userData = {
      email,
      uid: schoolCode,
      Role: "School",
      schoolName,
      phoneNumber,
      address: {
        district,
        street,
        city,
        postalCode,
      },
      buses: [],
      students: [],
      drivers: [],
      //coordinates: new admin.firestore.GeoPoint(Number(lat), Number(lng)),
      //createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Store user data in Firestore
    await admin.firestore().collection('School').doc(schoolCode).set(userData);

    // Send verification email
   
    await sendEmailVerification(email);  

    // Respond with success
    res.status(201).json({ schoolCode: userRecord.schoolCode });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});




router.post('/api/getschooldata', async (req, res) => {
  console.log('Server school data fetcher called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schoolDoc = await admin.firestore().collection('School').doc(decodedClaims.uid).get();
    
    if (!schoolDoc.exists) {
      return res.status(404).send('School not found');
    }

    const schoolData = schoolDoc.data();
    res.status(200).send(schoolData);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data fetch failed.');
  }
});

// Update school data
router.put('/api/schooldata', async (req, res) => {
  console.log('Server school data updater called');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schoolDocRef = admin.firestore().collection('School').doc(decodedClaims.uid);
    
    const { phoneNumber, address } = req.body; // Extract data from request body

    await schoolDocRef.update({
      phoneNumber,
      address
    });

    res.status(200).send('School data updated successfully.');
  } catch (error) {
    console.error('Token verification or data updating error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST! Invalid token or data update failed.');
  }
});
 

async function sendEmailVerification(email) {
  try {
    // Generate a verification link
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // Configure your email transport using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Setup email data
    const mailOptions = {
      from:process.env.EMAIL_SERVER,
      to: email,
      subject: 'تأكيد عنوان البريد الإلكتروني الخاص بك', // Subject in Arabic
      html: `<a href="https://ibb.co/T0v0ZLF"><img src="https://i.ibb.co/LgkgM52/maslakheader.jpg" alt="maslakheader" border="0"></a>
        <p>مرحبًا بك في منصه مسلك. يرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:</p>
        <a href="${verificationLink}">تأكيد البريد الإلكتروني</a>
        <p>إذا لم تطلب هذا البريد، يرجى تجاهل هذه الرسالة.</p>
      `,
    };

    // Send the verification email
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

////////////////////////////////////////////reset password email
async function sendPasswordResetLink(userRecord) {
  try {
    // Generate a password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(userRecord.email);

    // Configure your email transport using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_SERVER,
      to: userRecord.email,
      subject: 'إعادة تعيين كلمة المرور', // Subject in Arabic
      html: `<a href="https://ibb.co/T0v0ZLF"><img src="https://i.ibb.co/LgkgM52/maslakheader.jpg" alt="maslakheader" border="0"></a>
        <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:</p>
        <a href="${resetLink}">إعادة تعيين كلمة المرور</a>
        <p>إذا لم تطلب هذا البريد، يرجى تجاهل هذه الرسالة.</p>
      `,
    };

    // Send the password reset email
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}



/////////////////////////////////change email function
app.post('/api/changeemail', async (req, res) => {
  console.log('Change email server endpoint');
  const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
  const { newemail, password } = req.body;

  if (!idToken) {
    return res.status(403).send('UNAUTHORIZED REQUEST! No token provided.');
  }

  try {
    // Verify the token and get the current user's details
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const currentUserId = decodedClaims.uid;

    // Check if the new email already exists
    let existingUser;
    try {
      existingUser = await admin.auth().getUserByEmail(newemail);
      if (existingUser) {
        return res.status(400).send({ message: 'The new email is already in use by another account.' });
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        return res.status(500).send({ error: 'Error checking email availability.' });
      }
    }

    // Fetch user data from School collection
    const schoolRef = db.collection('School').doc(currentUserId);
    const schoolDoc = await schoolRef.get();

    if (!schoolDoc.exists) {
      return res.status(404).send('No school data found for this user.');
    }
    const schoolData = schoolDoc.data();
    await admin.auth().deleteUser(currentUserId);
    // Create a new account with the new email and password
    const newUser = await admin.auth().createUser({
      uid: schoolData.uid,
      email: newemail,
      password: password,
    });

    console.log('New user created:', newUser.uid);

  
    const newSchoolRef = db.collection('School').doc(newUser.uid);
    await newSchoolRef.set({
      ...schoolData,
      email: newemail, 
    });

    sendEmailVerification(newemail)

   

    res.status(200).send({ message: 'Email changed successfully. Please login with the new email.' });
  } catch (error) {
    console.error('Error occurred while changing email:', error);
    res.status(500).send('Failed to change email. Please try again later.');
  }
});





//////////////////////resend email verfication

app.post('/api/emailverification', async (req, res) => {
  console.log('Verification endpoint hit');
  const { email } = req.body;

  if (!email) {
    return res.status(403).send('no email'); // No email provided
  }
  
  try {
    // Check if a user with the provided email exists
    const userRecord = await admin.auth().getUserByEmail(email);

    // If the user exists, send the verification email
    await sendEmailVerification(userRecord);
    
    res.status(200).send(true);
  } catch (error) {
    // Handle errors when the user is not found or other issues
    if (error.code === 'auth/user-not-found') {
      return res.status(401).send('no account with this email!');
    }
    console.error('Error verifying email:', error);
    res.status(500).send('An error occurred while verifying the email.');
  }
});

////////////////////////////reset password from client
app.post('/api/passwordreset', async (req, res) => {
  console.log('password reset endpoint hit');
  const { email } = req.body;

  if (!email) {
    return res.status(403).send('no email'); // No email provided
  }
  
  try {
    // Check if a user with the provided email exists
    const formatemail=email.trim()
    const userRecord = await admin.auth().getUserByEmail(formatemail);

    // If the user exists, send the verification email
    await sendPasswordResetLink(userRecord);
    
    res.status(200).send(true);
  } catch (error) {
    // Handle errors when the user is not found or other issues
    if (error.code === 'auth/user-not-found') {
      return res.status(401).send('no account with this email!');
    }
    console.error('Error verifying email:', error);
    res.status(500).send('An error occurred while verifying the email.');
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
    // if (!decodedToken.email_verified) {
    //   return res.status(404).send('الرجاء التحقق من البريد الالكتروني');
    // }

    console.log(decodedToken.uid)
    const userDoc = await db.collection('School').doc(decodedToken.uid).get();
    //const userDoc = admin.firestore().collection('School').doc(schoolCode);
    if (!userDoc.exists) {
      return res.status(404).send('لا يوجد هذا المستخدم');
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
      return res.status(403).send('الحساب ليس حساب موثق لمدرسه');
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
  console.log('Server add  bus endpoint');
  
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  let {newbus} =req.body;
  if (!idToken ) {
    return res.status(403).send('failed');
  }


  try {
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid = decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);
    
    // Fetch the school document
    const schoolDoc = await schoolRef.get();
    const schoolData = schoolDoc.data();
    
    // Determine the length of the existing buses array
    const length = schoolData.buses.length;
    
    // Create a new bus ID based on the school UID and the next available bus index
    const busId = `${schooluid}B0${length + 1}`;
    console.log(busId);
    
    // Define the new bus object
    newbus = { 
      ...newbus,
      uid: busId,
      school: schoolRef, 
      students: [],
      driver: null,
      currentCapacity: 0,
    };
    console.log(newbus);
    
    // Set the new bus document with the specific UID
    const newBusRef = db.collection('Bus').doc(busId);
    await newBusRef.set(newbus);
    
    // Update the school document to include the new bus reference in the buses array
    const updatedSchoolData = { 
      ...schoolData, // Spread the existing data
      buses: [...(schoolData.buses || []), newBusRef], // Add the new bus reference to the buses array
    };
    
    // Update the school document
    await schoolRef.set(updatedSchoolData);
    
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

    const buses = busDocs.map(busDoc => ({ id: busDoc.uid, ...busDoc.data() }));

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

    // Fetch updated buses list from the school document
    const schoolDoc = await schoolRef.get();
    const schoolData = schoolDoc.data();
    const currentBuses = schoolData.buses || [];

    // Array to collect new bus references

    const updatedBusReferences = [];
    for (let index = 0; index < currentBuses.length; index++) {
      const oldBusRef = currentBuses[index];
      const newBusUid = `${schooluid}B0${index + 1}`;
    
      // Fetch current bus data
      const oldBusDoc = await oldBusRef.get();
      if (oldBusDoc.exists) {
        const oldBusData = oldBusDoc.data();
    
        // Delete the old bus document
        await oldBusRef.delete();
    
        // Create a new document with the new UID and copy over the old data
        const newBusRef = db.collection('Bus').doc(newBusUid);
        await newBusRef.set({
          ...oldBusData,
          uid: newBusUid // Update the UID field
        });
    
        // Add the new bus reference to the list at the correct index
        updatedBusReferences[index] = newBusRef;
      }
    }
    
    // Update the school document with new bus references
    await schoolRef.update({
      buses: updatedBusReferences
    });
    

    res.status(200).send({ message: 'Bus deleted, all buses re-ordered, and associated records updated successfully' });
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
      maximumCapacity: Number(newbus.maximumCapacity),
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
  let { newdriver } = req.body;

  if (!idToken) {
    return res.status(403).send({ error: 'Authorization token is missing.' });
  }

  const phone = '+966' + newdriver.driverPhone.trim(); // Format the phone number correctly

  try {
    // Step 1: Verify session token and get school reference
    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid = decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);

    // Step 2: Check if UID or Phone Number already exists in Firebase Auth
    let existingUser = null;
    
    try {
      existingUser = await admin.auth().getUser(newdriver.uid);
      if (existingUser) {
        return res.status(400).send({ error: 'يوجد سائق بهذه الهوية او الاقامة' });
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        return res.status(500).send({ error: 'Error checking UID: ' + error.message });
      }
    }

    try {
      existingUser = await admin.auth().getUserByPhoneNumber(phone);
      if (existingUser) {
        return res.status(400).send({ error: 'يوجد سائق مسجل بهذا الرقم.' });
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        return res.status(500).send({ error: 'Error checking phone number: ' + error.message });
      }
    }

    // Step 3: Create a new user record in Firebase Auth
    const userRecord = await admin.auth().createUser({
      uid: newdriver.uid,
      phoneNumber: phone
    });

    console.log('Successfully created new driver:', userRecord.uid);

    // Step 4: Prepare new driver data
    newdriver = { 
      driverFamilyName: newdriver.driverFamilyName,
      driverFirstName:newdriver.driverFirstName,
      school: schoolRef, 
      bus: null,
      uid: userRecord.uid,
      phoneNumber: phone,
      status: 'active'
    };

    // Step 5: Add new driver to the 'Driver' collection
    await db.collection('Driver').doc(userRecord.uid).set(newdriver);

    // Step 6: Fetch the school document
    const schoolDoc = await schoolRef.get();
    const schoolData = schoolDoc.data();

    // Step 7: Update school data with the new driver's UID
    const updatedSchoolData = { 
      ...schoolData,
      drivers: [...(schoolData.drivers || []), userRecord.uid]
    };

    await schoolRef.set(updatedSchoolData);

    console.log('Added driver');
    res.status(200).send({ success: true, message: 'Driver added successfully' });
  } catch (error) {
    console.error('Error occurred:', error);
    const errorMessage = error.message || 'An unexpected error occurred';
    res.status(500).send({ error: errorMessage });
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
  console.log('im inactivate')
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
    console.log(uid)

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
    const existingStudent = await db.collection('Student').doc(newstudent.studentId).get();
    if (existingStudent.exists) {
        console.log(`A student with ID ${newstudent.studentId} already exists.`);
       return res.status(401).send('يوجد طالب بهذه الهوية الوطنية او الاقامة مسبقا');
    }

    const decodedClaims = await admin.auth().verifySessionCookie(idToken, true);
    const schooluid = decodedClaims.uid;
    const schoolRef = db.collection('School').doc(schooluid);
    const parentPhone = '+966' + newstudent.parent_phone.trim();
    
    newaddedstudent = { 
      address:newstudent.address,
      uid: newstudent.studentId,
      studentFirstName: newstudent.studentFirstName,
      studentFamilyName: newstudent.studentFamilyName,
      grade:newstudent.grade,
      parentUid: newstudent.parentUid,
      parentPhone: parentPhone,
      boradingStatus:null,
      RFIDtag:null,
      school: schoolRef, 
      status: 'active', // Set status to active
      bus:null,
    };
    console.log('test')
    const newstudentRef = await db.collection('Student').doc(newstudent.studentId).set(newaddedstudent);
    const newStudentREfrence=db.collection('Student').doc(newstudent.studentId);

     //newstudentUID = newstudentRef.uid;
    //await db.collection('Student').doc(newstudentUID).update({ uid: newstudentUID });
    const schoolDoc = await admin.firestore().collection('School').doc(schooluid).get();
    const schoolData = schoolDoc.data();

    const newschoolDoc = {
      ...schoolData, // Spread the existing data
      students: [...(schoolData.students || []), newStudentREfrence], // Add the new student reference to the students array
    };

    await db.collection('School').doc(schooluid).set(newschoolDoc); 

    console.log('added student');
    res.status(200).send(true);
  } catch (error) {
    console.error('Token verification or data fetching error:', error);
    res.status(401).send('فشل في الاضافة');
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
    const newcapacity=Number(busData.currentCapacity)+1;
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
    const newcapacity=Number(busData.currentCapacity)-1; 

    await busRef.update({
      students: admin.firestore.FieldValue.arrayRemove(studentuid),
      currentCapacity:Number(newcapacity)
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


//////////////////////////////////////////////////////////////////parent functions
/*app.use(express.json());

app.get('/getParentData/:phoneNumber', async (req, res) => {
  console.log('server get parent data endpoint')
  const phoneNumber = req.params.phoneNumber; // Extract phone number from URL
  try {
    const parentRef = admin.firestore().collection('Parent').doc(phoneNumber);
    const parentDoc = await parentRef.get();
    if (!parentDoc.exists) {
      return res.status(404).send('Parent data not found');
    }
    // Fetch the data from the document
    const parentData = parentDoc.data();
    res.send({
      name: parentData.name,
      phoneNumber: parentData.phoneNumber,
    });
  } catch (error) {
    console.error('Error fetching parent data:', error);
    res.status(500).send('Error fetching parent data');
  }
});*/


///////////////////////////rfid 
// Middleware to parse JSON bodies
app.post('/api/rfid', (req, res) => {
  const cardUID = req.body.card_uid;
  
  console.log(`Received UID: ${cardUID}`);
  
  res.status(200).send("Received");
});



/////////////////////////////////////////parent application///////////////////////////////////////////


//////////////////////////////////////////get children data
app.get('/getChildrenData/:uid', async (req, res) => {
  const uid = req.params.uid;
  console.log(`Received phone number: ${uid}`);  // Log the received phone number

  try {
    // Query the Student collection to find all students linked to the parent_uid (which is the phone number)
    const studentRef = admin.firestore().collection('Student').where('parentUid', '==', uid);//اغيرها للهوية اذا ضبطت
    const childrenSnapshot = await studentRef.get();

    if (childrenSnapshot.empty) {
      console.log('No children found for this parent.');
      return res.status(404).send('No children found for this parent');
    }

    const childrenData = [];
    
    // Iterate over each student document and log their data to the console
    childrenSnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());  // Log student ID and data
      childrenData.push(doc.data());  // Add the student's data to the response
    });

    res.send(childrenData);  // Send the found children data back to the client
  } catch (error) {
    console.error('Error fetching children data:', error);
    res.status(500).send('Error fetching children data');
  }
});




////////////////////////////////////////////////add child
app.post('/api/addchild', async (req, res) => {
  console.log('Server add called for student');

  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  let { newChild } = req.body;

  if (!idToken) {
    return res.status(403).send('Unauthorized request');
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedClaims = await admin.auth().verifyIdToken(idToken, true);
    const parentUid = decodedClaims.uid;
    const parentPhone = decodedClaims.phone_number; // Extract the parent's phone number
    const nationalId = newChild.uid; // Extract the national ID from the request
    const schoolCode = newChild.school; // Extract the school code from the request

    if (!nationalId) {
      return res.status(400).send('National ID is required');
    }

    console.log('Decoded claims:', decodedClaims);
    console.log('National ID:', nationalId);
    console.log('School Code:', schoolCode);

    // Check if a student with the given national ID already exists in the "Student" collection
    const studentSnapshot = await db.collection('Student').doc(nationalId).get();

    if (studentSnapshot.exists) {
      console.log('Student with this national ID already exists');
      return res.status(409).send('Student with this national ID already exists');
    }

    // Define the new child object with additional fields
    newChild = {
      ...newChild,
      // parentUid: parentUid,
      parentPhone: parentPhone || null,
      status: 'inactive',
      bus: null,
      RFIDtag: null,
      boradingStatus: null,
    };

    // Use the national ID as the document ID in the "Student" collection
    const studentRef = db.collection('Student').doc(nationalId);
    await studentRef.set(newChild);

    console.log('Student added successfully to the Student collection with national ID as the document ID');

    // After adding the student to the "Student" collection, update the school's list of students with a Firestore reference
    const schoolSnapshot = await db.collection('School').doc(schoolCode).get();

    if (!schoolSnapshot.exists) {
      console.log('School with this code does not exist');
      return res.status(404).send('School with this code does not exist');
    }

    // Add the new student's Firestore reference to the school's student list
    await db.collection('School').doc(schoolCode).update({
      students: admin.firestore.FieldValue.arrayUnion(studentRef), // Use the Firestore DocumentReference
    });

    console.log(`Student reference ${studentRef.path} added to the school's student list as a reference`);
    res.status(200).send(true); // Respond with success
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Failed to add student');
  }
});


/////////////////////////////////////Delete student API
app.post('/api/deletestudent', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1] || ''; // Extract ID token
  const { uid } = req.body; // Expecting UID of the student to delete

  if (!uid) {
    return res.status(400).send('Student UID is required');
  }

  try {
    // Use verifyIdToken instead of verifySessionCookie
    const decodedClaims = await admin.auth().verifyIdToken(idToken, true); // Verify ID token instead of session cookie
    const parentUid = decodedClaims.uid; // Get the parent UID

    // Reference to the School document
    const schoolRef = db.collection('School').doc(parentUid);

    // Reference to the Student document
    const studentRef = db.collection('Student').doc(uid);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).send('Student not found'); // Return if student does not exist
    }

    // Fetch student's data
    const studentData = studentDoc.data();
    const busUid = studentData.bus; // Get the bus UID the student is assigned to, if any

    // Remove the student reference from the parent's 'students' array in the School document
    await schoolRef.update({
      students: admin.firestore.FieldValue.arrayRemove(uid),
    });

    // If the student was assigned to a bus, update the bus document to remove the student
    if (busUid) {
      const busRef = admin.firestore().collection('Bus').doc(busUid);
      const busDoc = await busRef.get();
      const busData = busDoc.data();
      const newCapacity = Number(busData.current_capacity) - 1; // Decrease the capacity

      await busRef.update({
        students: admin.firestore.FieldValue.arrayRemove(uid),
        current_capacity: Number(newCapacity), // Update bus capacity
      });
    }

    // Finally, delete the student document
    await studentRef.delete();

    console.log('Student deleted and associated bus updated successfully');
    res.status(200).send({ message: 'Student deleted and associated bus updated successfully' });
  } catch (error) {
    console.error('Error deleting student and updating bus:', error);
    res.status(500).send('Failed to delete student and update bus');
  }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
