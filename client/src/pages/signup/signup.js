import './signup.css';
import React, { useState } from 'react';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation, { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation';
import Textinput from '../../components/input/input';
import axios from 'axios';
import { baseURL, REGISTER } from '../../Api/Api';
import { useNavigate } from 'react-router-dom';
import { FaStarOfLife } from "react-icons/fa";
import SuccessMessage from '../../components/successMessage/successMessage.js'
import { CgSpinnerAlt } from 'react-icons/cg';

const SignupForm = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSuccess, setIsSuecess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1); // Track which form step we're in
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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

    if (name === 'password' && value.length < 6) {
      error = 'كلمة المرور يجب أن تتكون من 6 خانات على الأقل';
    } else if (name === 'confirmPassword' && value !== form.password) {
      error = 'كلمة المرور غير مطابقة';}
    // } else if (name === 'phoneNumber' && (!/^[5]\d{8}$/.test(value))) {
    //   error = 'يجب أن يبدأ رقم الهاتف بـ 5 ويتكون من 9 أرقام فقط';
    // }

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
      if (!form.email.includes('@')) newErrors.email = ' @ يجب أن يحتوي الايميل على ';
      if (form.password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تتكون من 6 خانات على الأقل';
      }
    } else if (formStep === 2) {
      if (!form.schoolName) newErrors.schoolName = ' الرجاء ادخال اسم المدرسة';
      if (!/^[5]\d{8}$/.test(form.phoneNumber)) {
        newErrors.phoneNumber = ' يجب ان يحتوي رقم الهاتف على 12 خانة ويبدا  966';
      }
      if (!form.district.trim()) newErrors.district = 'الرجاء ادخال اسم الحي'
      if (!form.street.trim()) newErrors.street = 'الرجاء ادخال اسم الشارع';
      if (!form.city.trim()) newErrors.city = 'الرجاء ادخال اسم المدينة';
      if (!/^\d{5}$/.test(form.postalCode)) newErrors.postalCode = 'يجب أن يتكون الكود البريدي من 5 أرقام فقط';
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
    setLoading(true)
    e.preventDefault();

    if (!validateFormStep()) return;

    try {
      const response = await axios.post(`${baseURL}/${REGISTER}`, form);
      console.log(response)
      if (response.data.success) {
        
        handleSuccessOperation()
      } else if (!response.data.success){
        console.log(response.data)
        setIsSuecess(response.data.message);
      }
    } catch (err) {
      setIsSuecess('حدثت مشكلة اثناء التسجيل. الرجاء إعادة المحاولة');
    }finally{
      setLoading(false)
    }
  };
  
  const handleSuccessOperation = () => {
    setShowSuccess(false);
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login'); // Replace '/login' with the route for your login page
      }, 2000);
    }, 0);
  };
  return (
    <div className="Login">
      <GifLogo />
      {showSuccess && <SuccessMessage message="تم التسجيل بنجاح! الرجاء التحقق من البريد" />}
      <GreenContainer>
        <h1>تسجيل حساب جديد للمدرسة</h1>

        {formStep === 1 && (
          <form onSubmit={handleFirstFormSubmit} className="form-step">
            <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />البريد الالكتروني</h2>
            <Textinput
              type="text"
              width={100}
              content="البريد الالكتروني"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /> رمز المرور</h2>
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

            <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />تأكيد رمز المرور</h2>
            <Textinput
              type="password"
              width={100}
              placeholder="تأكيد الرمز السري"
              content="تأكيد الرمز السري"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}


            <button className="signup-button" type="submit">
              التالي
            </button>
          </form>
        )}

        {formStep === 2 && (
          <div className="scrollable-form">
            <form onSubmit={handleFinalSubmit} className="form-step">
            <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /> اسم المدرسة</h2>
              <Textinput
                type="text"
                width={100}
                content="اسم المدرسة"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
              />
              {errors.schoolName && <p className="error-text">{errors.schoolName}</p>}

              <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /> رقم الاتصال</h2>

              <Textinput
                type="text"
                width={100}
                content="رقم الاتصال"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                maxLength="9" 
                number={'+966'}
                />
           
              <small style={{color:'gray'}}>{form.phoneNumber.length}/9</small>
              {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}

              <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /> المدينة</h2>
              <Textinput
                type="text"
                width={100}
                content=" المدينة"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
                {errors.city && <p className="error-text">{errors.city}</p>}

              <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /> الحي</h2>
              <Textinput
                type="text"
                width={100}
                content="الحي"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
              {errors.district && <p className="error-text">{errors.district}</p>}

              <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />الشارع</h2>
              <Textinput
                type="text"
                width={100}
                content="الشارع"
                name="street"
                value={form.street}
                onChange={handleChange}
              />
              {errors.street && <p className="error-text">{errors.street}</p>}


            <h2> <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /> الرمز البريدي</h2>
              <Textinput
                type="text"
                width={100}
                content="الرمز البريدي"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
              />
              {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}

              {isSuccess && <p className="error-text">{isSuccess}</p>}

              <button
              className="signup-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CgSpinnerAlt style={{ marginRight: '5px' }} className="spinner" />
              ) : (
                "انشاء حساب"
              )}
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
