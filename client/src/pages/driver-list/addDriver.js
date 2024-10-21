import { AddDriverToDatabase } from './driverListData';
import './addDriver.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import Header from '../../components/header/header.js';
import { CgSpinnerAlt } from "react-icons/cg";
import { FaStarOfLife } from "react-icons/fa";
import SuccessMessage from '../../components/successMessage/successMessage.js'


const AddDriver = () => {
  const [driverFirstName, setDriverFirstName] = useState('');
  const [driverFamilyName, setDriverFamilyName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [uid, setUid] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^5[0-9]{8}$/; // Regex to match a phone number starting with 5 followed by exactly 8 digits
    return phoneRegex.test(phone);
  };
  
  const validateID = (ID) => {
    const phoneRegex = /^\d{10}$/; // Regex to match a phone number with a maximum of 10 digits
    return phoneRegex.test(ID);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zأ-ي]{2,}$/; // Regex to match at least 3 letters (supports English and Arabic letters)
    return nameRegex.test(name);
  };

  const addDriver = async (driverFirstName, driverFamilyName, uid, driverPhone) => {
    try {
      setLoading(true);
      const newDriver = {
        uid: uid,
        driverPhone: driverPhone,
        driverFirstName: driverFirstName,
        driverFamilyName: driverFamilyName,
      };
      
      const response = await AddDriverToDatabase(newDriver);
  
      if (response.error) {
        setError(response.error); 
        return; 
      }
      handleSuccessOperation()
    } catch (err) {
      const errorMessage = err.message || 'فشل باضافة السائق';
      setError(errorMessage); 
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!driverFirstName.trim() || !driverFamilyName.trim() || !uid.trim() || !driverPhone.trim()) {
      setError('جميع الحقول مطلوبة');
      return false;
    }
  
    // Check if the driver's first name is provided
    if (!driverFirstName.trim()) {
      setError('اسم السائق الأول مطلوب.');
      return; // Exit early if the first name is not provided
    }
  
    // Validate the phone number
    if (!validatePhoneNumber(driverPhone)) {
      setError('رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام');
      return; // Exit early if the phone number is invalid
    }
  
    if (!validateID(uid)) {
        setError('رقم الهويه او الاقامة يجب ان يتكون من 10 ارقام صحيحة');
        return; // Exit early if the phone number is invalid
      }

      if (!validateName(driverFamilyName)) {
        setError('الاسم يجب ان يحتوي على حرفين عالاقل');
        return; // Exit early if the phone number is invalid
      }

      if (!validateName(driverFirstName)) {
        setError('الاسم يجب ان يحتوي على حرفين عالاقل');
        return; // Exit early if the phone number is invalid
      }
    // Clear error message if all validations pass
    setError('');
  
    // Proceed with adding the driver
    addDriver(driverFirstName,driverFamilyName,uid,driverPhone);
  };
  
  const handleSuccessOperation = () => {
    setShowSuccess(false); 
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => navigate('/driverList'), 2000); // Navigate after 2 seconds
    }, 0);
  };
  return (
    <div className="add-bus-page">
      {showSuccess && <SuccessMessage message="تمت إضافة سائق بنجاح" />}
      <Sidebar />
      <div className="add-bus-main">
        <Header />
        <div className="bus-detail-buttons">
          <button className='edit-bus-button' onClick={() => navigate('/driverList')}>عودة</button>
        </div>
        <div className="add-bus-content">
          <FormContainer>
            <div className="title-container">
              <h1>تسجيل سائق جديد</h1>
              <div className="line"></div>
            </div>
            <form onSubmit={handleSubmit} className="add-bus-form">
              <div className="form-group">
                <div className="title-container">
                  <h3>معلومات السائق الشخصية</h3>
                  <div className="line"></div>
                </div>
                <label htmlFor="busId" className="form-label">اسم السائق الاول<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="driverFirstName"
                  className="form-input"
                  value={driverFirstName}
                  onChange={(e) => setDriverFirstName(e.target.value)}
                  placeholder="اسم السائق الاول"
              
                />
                <label htmlFor="driverFamilyName" className="form-label">اسم عائلة السائق <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="driverFamilyName"
                  className="form-input"
                  value={driverFamilyName}
                  onChange={(e) => setDriverFamilyName(e.target.value)}
                  placeholder="اسم عائلة السائق "
           
                />
                <label htmlFor="driverId" className="form-label">الإقامة او الهوية الوطنية<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="uid"
                  className="form-input"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="الإقامة او الهوية الوطنية"
                   maxLength="10"
                />
                 <small style={{color:'gray'}}>{uid.length}/10</small>
                <label htmlFor="driverPhone" className="form-label">رقم جوال السائق<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <div className="phone-input" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    id="driverPhone"
                    className="form-input"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="5xxxxxxxx"
                     maxLength="9"
                    style={{ direction: 'ltr' }}
                  />
                  <input type="text" className="form-input" value="966+" disabled style={{ width: '35px' }} />
                </div>
                <small style={{color:'gray'}}>{driverPhone.length}/9</small>
                 <p style={{marginTop:'1px', color:'#555'}}><FaStarOfLife size={6} style={{ color: 'black', marginLeft: '5px', marginBottom: '0px' }} />عند اضافة رقم السائق سيستخدم رقم الجوال لانشاء حساب للسائق </p>   
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className='button-area'>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <>جاري الاضافة <CgSpinnerAlt style={{ marginRight: '2px' }} className='spinner' /> </> : 'اضافة'}
                </button>
               
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
