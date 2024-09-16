import { auth } from '../../firebaseConfig.js';
import { baseURL, REGISTER } from '../../Api/Api';
import axios from 'axios';

const HandleSignup = async (form) => {
    try{
        await axios.post(`${baseURL}/${REGISTER}`, form);
        return { success: true };
    }catch(err){
    return { err };
    }


//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
//     const user = userCredential.user;
//     const token = await user.getIdToken();
//     console.log('Token:', token);
//     const response = await axios.post('http://localhost:5000/api/auth', { token });
//     return { success: true, data: response.data };
//   } catch (err) {
//     const error = err.code === 'auth/wrong-password'
//       ? 'Incorrect password'
//       : err.code === 'auth/user-not-found'
//       ? 'User not found'
//       : 'Login failed: ' + err.message;
//     return { error };
//   }
};

export default HandleSignup;
