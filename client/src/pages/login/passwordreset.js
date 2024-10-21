import './login.css';
import React, { useState } from 'react';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation';
import { sendPasswordReset } from './handleLogin';
import Textinput from '../../components/input/input';
import { useNavigate } from 'react-router-dom';
import SuccessMessage from '../../components/successMessage/successMessage';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSent, setIsSent] = useState(false); // New state variable

  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Check if email is empty
    if (!email.trim()) {
      setError("الرجاء إدخال البريد الإلكتروني.");
      return;
    }
  
    // Basic validation for email syntax
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      return;
    }

    try {
      // Proceed with sending verification email if validation passes
      const result = await sendPasswordReset(email);

      if (result.error) {
        setError(result.error);
   
      } else {
        // Show success message
        handleSuccessOperation();

        setIsSent(true); // Set the isSent state to true to hide the button
      }
    } catch (err) {
      setError("حدث خطأ أثناء إرسال البريد الإلكتروني. حاول مرة أخرى.");

    }
  };

  const handleSuccessOperation = () => {
    // Reset the state to show the success message
    setShowSuccess(false); // Ensure it's hidden before showing again (reset state)
    setTimeout(() => setShowSuccess(true), 0); // Trigger the success message
  };

  return (
    <div>
      {showSuccess && <SuccessMessage message="تم ارسال بريد لاعاده تعيين الرمز السري بنجاح" />}
      <div className='Login'>
        <GifLogo />
        <GreenContainer>
          <h1>اعادة تعيين الرمز السري  </h1>
          <form onSubmit={onSubmit}>
            <h2>البريد الالكتروني</h2>
            <Textinput
              type="text"
              width={100}
              content="البريد الالكتروني"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // Reset error on typing
              }}
            />
            {!isSent ? (
              <button className='login-button' type="submit">ارسال </button>
            ) : (
              <p style={{ color: 'green', fontWeight: 'bold' }}>تم الارسال بنجاح</p>
            )}
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
            <button className='no-button-signup' onClick={() => navigate('/login')} style={{ verticalAlign: 'middle' }}>اضغط هنا</button> 
            العودة لصفحة تسجيل الدخول
          </p>
        </GreenContainer>
      </div>
      <SaudiAnimation />
    </div>
  );
}
