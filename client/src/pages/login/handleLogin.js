import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js'; // Import Firebase auth object
import axios from 'axios';

// Function that handles login and communicates with Firebase and server
const handleLogin = async (email, password) => {
  try {
    // Firebase sign-in
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    const user = userCredential.user;

    // Get user token//idkkkkk
    const token = await user.getIdToken();

    // Send token to backend server
    const response = await axios.post('http://localhost:5000/api/auth', { token });

    // Return success response
    return { success: true, data: response.data };
  } catch (err) {
    // Return error message
    return { error: 'Login failed: ' + err.message };
  }
};

export default handleLogin;
