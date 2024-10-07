import { AddDriverToDatabase } from './driverListData';
import './addDriver.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import Header from '../../components/header/header.js';
import { CgSpinnerAlt } from "react-icons/cg";
import { FaStarOfLife } from "react-icons/fa";


const AddDriver = () => {
  const [driverFirstName, setDriverFirstName] = useState('');
  const [driverFamilyName, setDriverFamilyName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverId, setDriverId] = useState('');
  //const [countries, setCountries] = useState([]);
  //const [driverCountry, setDriverCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^5[0-9]{8}$/; // Regex to match a phone number starting with 5 followed by exactly 8 digits
    return phoneRegex.test(phone);
  };
  
  const validateID = (ID) => {
    const phoneRegex = /^\d{1,10}$/; // Regex to match a phone number with a maximum of 10 digits
    return phoneRegex.test(ID);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zأ-ي]{3,}$/; // Regex to match at least 3 letters (supports English and Arabic letters)
    return nameRegex.test(name);
  };


  // Fetch countries inside useEffect
//   useEffect(() => {
//     const fetchCountries = async () => {
//         try {
//             const response = await fetch('/countries.json'); // Adjust the path if needed
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             const data = await response.json(); // Parse the JSON data
//             setCountries(data); // Set the state with the
//         } catch (error) {
//           console.error('Error fetching countries:', error);
//           setError('Failed to fetch countries');
//         } finally {
//           setLoading(false); // Always set loading to false after fetching
//         }
//       };
  
//       fetchCountries();
//     }, []); 

  const addDriver = async (driverFirstName, driverFamilyName,driverId,driverPhone) => {
    try {
      setLoading(true);
      const newDriver = {
        driverId:driverId,
        driverPhone:driverPhone,
        driverFirstName: driverFirstName,
        driverFamilyName: driverFamilyName,
      };
      await AddDriverToDatabase(newDriver);
      navigate('/driverList');
    } catch (err) {
      setError('Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Check if the driver's first name is provided
    if (!driverFirstName.trim()) {
      setError('اسم السائق الأول مطلوب.');
      return; // Exit early if the first name is not provided
    }
  
    // Validate the phone number
    if (!validatePhoneNumber(driverPhone)) {
      setError('رقم الجوال يجب أن يتكون من 9 أرقام صحيحة.');
      return; // Exit early if the phone number is invalid
    }
  
    if (!validateID(driverId)) {
        setError('رقم الهويه او الاقامة يجب ان لا يتعدى 11 رقم صحيح');
        return; // Exit early if the phone number is invalid
      }

      if (!validateName(driverFamilyName)) {
        setError('رقم الهويه او الاقامة يجب ان لا يتعدى 11 رقم صحيح');
        return; // Exit early if the phone number is invalid
      }

      if (!validateName(driverFirstName)) {
        setError('الاسم يجب ان يحتوي على 3 حروف عالاقل');
        return; // Exit early if the phone number is invalid
      }
    // Clear error message if all validations pass
    setError('');
  
    // Proceed with adding the driver
    addDriver(driverFirstName,driverFamilyName,driverId,driverPhone);
  };
  

  return (
    <div className="add-bus-page">
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
                  required
                />
                <label htmlFor="driverFamilyName" className="form-label">اسم عائلة السائق <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="driverFamilyName"
                  className="form-input"
                  value={driverFamilyName}
                  onChange={(e) => setDriverFamilyName(e.target.value)}
                  placeholder="اسم عائلة السائق "
                  required
                />
                <label htmlFor="driverId" className="form-label">الإقامة او الهوية الوطنية<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="driverId"
                  className="form-input"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  placeholder="الإقامة او الهوية الوطنية"
                  required
                />
                <label htmlFor="driverPhone" className="form-label">رقم جوال السائق<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <div className="phone-input" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    id="driverPhone"
                    className="form-input"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="5xxxxxxxx"
                    required
                    style={{ direction: 'ltr' }}
                  />
                  <input type="text" className="form-input" value="+966" disabled style={{ width: '35px' }} />
                </div>
                {/* Country Dropdown */}
    {/* <label htmlFor="driverCountry" className="form-label">الجنسية<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <select
        id="driverCountry"
        className="form-input"
        value={driverCountry} // Bind the value of the select
        onChange={(e) => setDriverCountry(e.target.value)} // Handle change on select
      >
         <option value="" disabled style={{ color: 'gray' }}>اختار جنسية السائق</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
                  </option>
             ))}
           </select> */}

           
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
