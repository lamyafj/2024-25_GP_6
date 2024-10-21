import './signup.css';
import React, { useState } from 'react';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation';
import Textinput from '../../components/input/input';
import axios from 'axios';
import { baseURL, REGISTER } from '../../Api/Api';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(1); // Track which form step we're in
  const [form, setForm] = useState({
    email: '',
    password: '',
    schoolName: '',
    phoneNumber: '',
    district: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    validateInput(e.target.name, e.target.value);
  };

  // Validate input fields
  const validateInput = (name, value) => {
    let error = '';

    if (name === 'email' && (!value.includes('@') || !value)) {
      error = '* يجب أن يحتوي الايميل على @';
    } else if (name === 'password' && (!/[A-Za-z]/.test(value) || !/\d/.test(value) || value.length < 6)) {
      error =  '* كلمة السر يجب ان تحتوي حرف واحد ورقم واحد  وعلى الاقل ستة ';
    } else if (name === 'phoneNumber' && (!value.startsWith('966') || value.length !== 12)) {
      error =  '* يجب ان يحتوي رقم الهاتف على 12 خانة ويبدا  966';
    } else if (name === 'postalCode' && !value) {
      error = '* ادخل الكود البريدي';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Validate each form step
  const validateFormStep = () => {
    let isValid = true;
    const newErrors = {};

    if (formStep === 1) {
      if (!form.email.includes('@')) newErrors.email = '* يجب أن يحتوي الايميل على @';
      if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password) || form.password.length < 6) {
        newErrors.password = '* كلمة السر يجب ان تحتوي حرف واحد ورقم واحد  وعلى الاقل ستة ';
      }
    } else if (formStep === 2) {
      if (!form.schoolName) newErrors.schoolName = '* يجب أن تكتب اسم المدرسة ';
      if (!form.phoneNumber.startsWith('966') || form.phoneNumber.length !== 12) {
        newErrors.phoneNumber = '* يجب ان يحتوي رقم الهاتف على 12 خانة ويبدا  966';
      }
      if (!form.district) newErrors.district = '* ادخل اسم الحي'
      if (!form.street) newErrors.street = '* ادخل اسم الشارع';
      if (!form.postalCode) newErrors.postalCode = '* ادخل الكود البريدي';
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  // Handle the first form submission
  const handleFirstFormSubmit = (e) => {
    e.preventDefault();
    if (validateFormStep()) {
      setFormStep(2); // Move to the second form
    }
  };

  // Handle the final form submission
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormStep()) return;

    try {
      const response = await axios.post(`${baseURL}/${REGISTER}`, form);
      if (response.data.uid) {
        navigate('/login');
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: 'An error occurred during registration.' });
    }
  };

  return (
    <div className="Login">
      <GifLogo />
      <GreenContainer>
        <h1>تسجيل حساب للمدرسة</h1>

        {formStep === 1 && (
          <form onSubmit={handleFirstFormSubmit} className="form-step">
            <h2>البريد الالكتروني</h2>
            <Textinput
              type="email"
              width={100}
              content="البريد الالكتروني"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <h2>الرمز السري</h2>
            <Textinput
              type="password"
              width={100}
              placeholder="الرمز السري"
              content="الرمز السري"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}

            <button className="signup-button" type="submit">
              التالي
            </button>
          </form>
        )}

        {formStep === 2 && (
          <div className="scrollable-form">
            <form onSubmit={handleFinalSubmit} className="form-step">
              <h2>اسم المدرسة</h2>
              <Textinput
                type="text"
                width={100}
                content="اسم المدرسة"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
              />
              {errors.schoolName && <p className="error-text">{errors.schoolName}</p>}

              <h2>رقم الهاتف</h2>
              <Textinput
                type="text"
                width={100}
                content="رقم الهاتف"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}

              <h2>الحي</h2>
              <Textinput
                type="text"
                width={100}
                content="الحي"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
              {errors.district && <p className="error-text">{errors.district}</p>}

              <h2>الشارع</h2>
              <Textinput
                type="text"
                width={100}
                content="الشارع"
                name="street"
                value={form.street}
                onChange={handleChange}
              />
              {errors.street && <p className="error-text">{errors.street}</p>}

              <h2> المدينة</h2>
              <Textinput
                type="text"
                width={100}
                content=" المدينة"
                name="city"
                value={form.city}
                onChange={handleChange}
              />

              <h2>الرمز البريدي</h2>
              <Textinput
                type="text"
                width={100}
                content="الرمز البريدي"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
              />
              {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}

              <button className="signup-button" type="submit">
                انشاء حساب 
              </button>
            </form>
          </div>
        )}

        <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
          
        </p>
      </GreenContainer>
      <SaudiAnimation />
    </div>
  );
};

export default SignupForm;
