// src/pages/Login/Login.js
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation from '../../components/SaudiAnimation/SaudiAnimation';
import { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation.js';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js'; // Import the Firebase auth object
import axios from 'axios'; // Axios to send the token to the server

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;
  
      const token = await user.getIdToken();
  
      // Send token to the server
      const response = await axios.post('http://localhost:5000/api/auth', { token });
  
      console.log('Server Response:', response.data);
    } catch (err) {
      setError('Login failed: ' + err.message);  // Display the specific error message
      console.error('Error:', err);
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
