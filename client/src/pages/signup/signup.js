import './signup.css';
import React, { useState } from 'react';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation';
//import HandleSignup from './handleSignup.js'
import Textinput from '../../components/input/input';
import axios from 'axios';
import { baseURL, REGISTER } from '../../Api/Api';
//import HandleSignup from './handlesignup';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate =useNavigate();
  const [form, setForm] = useState({
    schoolCode: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // To handle error display
  const [success, setSuccess] = useState(''); // To handle success message

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear error before a new submission
    setSuccess('');

    try {
      const result = await HandleSignup(form);
      if (result.success) {
        setSuccess('User registered successfully');
        console.log('User registered successfully');
        setTimeout(() => {navigate('/login');}, 5000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error during registration:', err);
    }
  };

  const HandleSignup = async (form) => {
    try {
      const response = await axios.post(`${baseURL}/${REGISTER}`, form);
      return { success: true };
    } catch (err) {
      return { success: false, err };
    }
  };

  return (
    <div>
      <div className='Login'>
        <GifLogo />
        <GreenContainer>
          <h1>تسجيل حساب للمدرسة</h1>
          <div className='hLine'></div>

          <form onSubmit={onSubmit}>
            <h2>اسم المدرسة</h2>
            <Textinput
              type="text"
              width={100}
              content="اسم المدرسة"
              id='schoolCode'
              name='schoolCode'
              value={form.schoolCode}
              onChange={handleChange}
            />

            <h2>البريد الالكتروني</h2>
            <Textinput
              type="email"
              width={100}
              content="البريد الالكتروني"
              name='email'
              value={form.email}
              onChange={handleChange}
            />
            <h2>الرمز السري</h2>
            <Textinput
              type="password"
              width={100}
              placeholder="الرمز السري"
              content="الرمز السري"
              name='password'
              value={form.password}
              onChange={handleChange}
            />
            <button type="submit">تسجيل حساب جديد</button>
          </form>

          {error && <p style={{ color: 'red' }}>فشلت علمية التسجيل</p>}
          {success && <p style={{ color: 'green' }}>تم التسجيل بنجاح</p>}

          <p style={{ fontSize: '15px' }}>هل لديك حساب مسبق؟</p>
        </GreenContainer>
      </div>
      <SaudiAnimation />
    </div>
  );
};

export default SignupForm;
