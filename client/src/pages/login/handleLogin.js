import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import axios from 'axios';
import { baseURL, AUTH } from '../../Api/Api';

const handleLogin = async (email, password) => {
  try {
  
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    const user = userCredential.user;
    const token = await user.getIdToken();

    console.log('Firebase ID Token:', token);
    
    const response = await axios.post(`${baseURL}/${AUTH}`, { idToken: token }, // Sending idToken to the server
      {
        withCredentials: true, // Ensure cookies are sent and received
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, data: response.data };  // Successfully logged in
  } catch (err) {
    // Handle errors
    const errorCode = err.response ? err.response.data : err.code; // Capture error from server or Firebase
    console.error('Login error:', errorCode);
    return { success: false, error: errorCode };  // Return error for further handling
  }
};

export default handleLogin;










// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { baseURL, AUTH } from '../../Api/Api';
// import { auth } from '../../firebaseConfig.js';
// import axios from 'axios';


// const handleLogin = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
//     const user = userCredential.user;
//     const token = await user.getIdToken();
//     console.log('Token:', token);
    
//     // Send the token to the server
//     const response = await axios.post('http://localhost:5000/api/auth', { token }, { withCredentials: true });
//     return { success: true, data: response.data };
//   } catch (err) {
//     const error = err.code;
//     return { error };
//   }
// };

// export default handleLogin;

//////////////////////
