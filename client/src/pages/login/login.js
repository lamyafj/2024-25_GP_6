import './login.css';
import React, { useState } from 'react';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation';
import handleLogin from './handleLogin';
import Textinput from '../../components/input/input';
 import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  //const { setIsAuthenticated } = useAuth(); 

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin(email, password);
    if (result.error) {
      setError(result.error);
    } else {    
      //setIsAuthenticated(true);
      navigate('/adminDashboard'); 
    }
  };

  return (
    <div>
      <div className='Login'>
        <GifLogo />
        <GreenContainer>
          <h1>تسجيل الدخول</h1>
          <div className='hLine'></div>
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
              content="الرمز السري"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='login-button' type="submit">تسجيل دخول</button>
          </form>
          {error && <p style={{ color: 'red' }}>خطأ في البريد الألكتروني او الرمز السري</p>}
          <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
          <button className='no-button-signup' onClick={() => navigate('/signup')} style={{ verticalAlign: 'middle' }}>اضغط هنا</button> 
         ليس لديك حساب؟
          </p>
        </GreenContainer>
      </div>
      <SaudiAnimation />
    </div>
  );
}


