import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import axios from 'axios';


const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    const user = userCredential.user;
    const token = await user.getIdToken();
    console.log('Token:', token);
    const response = await axios.post('http://localhost:5000/api/auth', { token });
    
    return { success: true, data: response.data };
  } catch (err) {
    const error = err.code 
    return { error };
  }
};

export default handleLogin;

