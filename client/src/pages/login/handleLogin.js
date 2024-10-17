import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import axios from 'axios';
import { baseURL, AUTH , EMAILVERIFICATION,PASSWORDRESET} from '../../Api/Api';

const handleLogin = async (email, password) => {
  try {
  
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    const user = userCredential.user;
    const token = await user.getIdToken(true);

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
    if(err.code==='auth/invalid-credential'){
      return { success: false, error: 'خطأ في البريد او الرمز السري'};
    }
    console.error('Login error:', errorCode);
    return { success: false, error: errorCode };  // Return error for further handling
  }
};


export const sendEmailverification = async (email) => {
  console.log('Function to send email verification called');
  try {
    const response = await axios.post(`${baseURL}/${EMAILVERIFICATION}`, { email }, {
      withCredentials: true, // Important to include cookies in the request
    });

    // Check if the response is successful
    if (response.status === 200) {
      console.log('Verification email sent successfully');
      return { success: true };
    }
  } catch (error) {
    console.error('Error during email verification:', error);
    return { error: error.response?.data || 'Failed to send verification email' };
  }
};

export const sendPasswordReset = async (email) => {
  console.log('Function to send passwordreset called');
  try {
    const response = await axios.post(`${baseURL}/${PASSWORDRESET}`, { email }, {
      withCredentials: true, // Important to include cookies in the request
    });

    // Check if the response is successful
    if (response.status === 200) {
      console.log('Verification email sent successfully');
      return { success: true };
    }
  } catch (error) {
    console.error('Error during email verification:', error);
    return { error: error.response?.data || 'Failed to send verification email' };
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
