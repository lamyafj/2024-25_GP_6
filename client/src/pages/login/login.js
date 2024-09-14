import React, { useState } from 'react';
import './login.css';
import GreenContainer from '../../components/GreenContainer/GreenContainer.js';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation.js';
import handleLogin from './handleLogin.js';  // Import the login handler
import Textinput from '../../components/input/input.js'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handles form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      // Handle success (e.g., redirect to a dashboard)
      console.log('Login successful!');
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div className='Login'>
        <GifLogo />
        <GreenContainer>
          <h1>تسجيل الدخول</h1>
          <form onSubmit={onSubmit}>
  
            <h2>البريد الالكتروني</h2>
            
            <Textinput
            type="email"
            width={100}
             content="البريد الالكتروني"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
                  />
            <h2>الرمز السري</h2>
            <Textinput
            type="password"
            width={100}
            placeholder="الرمز السري"
            content="الرمز السري" // This content can be used for label text
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                />
            <button type="submit">تسجيل دخول</button>
          </form>
          <p style={{ fontSize: '15px' }}>هل نسيت رمز الدخول؟</p>
        </GreenContainer>
      </div>
      <SaudiAnimation />
    </div>
  );
}

export default Login;
