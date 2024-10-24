import './login.css';
import React, { useState,useContext  } from 'react';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation';
import handleLogin from './handleLogin';
import Textinput from '../../components/input/input';
 import { useNavigate } from 'react-router-dom';
import { SchoolRecordContext  } from '../../context/UserContext';
import { CgSpinnerAlt } from 'react-icons/cg';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorpage, setError] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const navigate = useNavigate();
  const [Verification, setVerification]=useState(false);
  const { schoolRecord, refetchSchoolRecord, loading ,error} = useContext(SchoolRecordContext);
  //const { setIsAuthenticated } = useAuth(); 

  const handleReFetch = () => {
    refetchSchoolRecord();
  };

  const onSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
  
    // Check if email or password is empty
    if (!email.trim()) {
      setError("الرجاء إدخال البريد الإلكتروني");
      return;
    }
  
    if (!password) {
      setError("الرجاء إدخال كلمة المرور");
      return;
    }
  
    // Basic validation for email length and syntax
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      return;
    }
  
    // Check if password is at least 6 characters long
    if (password.length < 6) {
      setError("يجب أن تكون كلمة المرور أطول من 6 أحرف");
      return;
    }
  
    try{

   
    // Proceed with login if validation passes
    const result = await handleLogin(email, password);
    console.log('result', result);
  
    if (result.error) {
      setError(result.error);
      if (result.error === 'الرجاء التحقق من البريد الالكتروني') {
        setVerification(true);
      }
    } else {
      // Navigate to admin dashboard
      handleReFetch()
      navigate('/adminDashboard');
    } }catch(err){
      setError(err)
    }finally{
      setIsLoading(false)
    }
  };

  // const sendEmailverification  = async (navigate) => { 
  //   try {
  //     const result = await handleLogin(email, password);
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   }
  // };

  
  return (
    <div>
      <div className='Login'>
        <GifLogo />
        <GreenContainer>
          <h1>تسجيل الدخول</h1>

          <form onSubmit={onSubmit}>
            <h2>البريد الالكتروني</h2>
            <Textinput
              type="text"
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
            <button className='login-button' type="submit" disabled={isLoading}>
            {isLoading ? <CgSpinnerAlt className="spinner" /> : "تسجيل دخول"}
          </button>

          </form>
          {errorpage && <p style={{ color: 'red' }}>{errorpage}</p>}
          {Verification &&<p style={{ fontSize: '15px', lineHeight: '1.5' }}>
          <button className='no-button-signup' onClick={() => navigate('/emailverification')} style={{ verticalAlign: 'middle' }}>اضغط هنا</button> 
         لم تتلقى رسالة تحقق للبريد؟
          </p> }
          <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
          <button className='no-button-signup' onClick={() => navigate('/passwordreset')} style={{ verticalAlign: 'middle' }}>اضغط هنا</button> 
         هل نسيت رمز المرور؟
          </p>
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


