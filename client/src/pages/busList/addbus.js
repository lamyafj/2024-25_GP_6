import { AddBusToDatabase } from './busListData';
import './addbus.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import Header from '../../components/header/header.js';
import { CgSpinnerAlt } from "react-icons/cg";
import { FaStarOfLife } from "react-icons/fa";
import SuccessMessage from '../../components/successMessage/successMessage.js'

const AddBus = () => {
  const [busName, setBusName] = useState('');
  const [busCapacity, setBusCapacity] = useState('');
  const [busPlate, setBusPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Single error state
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Regex for bus plate validation
  const plateRegex = /^[A-Za-z\u0600-\u06FF]{3}\d{3,4}$/;// Example format: 3 letters followed by 4 digits

  const addBus = async (busName, busCapacity, busPlate) => {
    try {
      setLoading(true);
      const newBus = { 
        name: busName,
        plate: busPlate,
        maximumCapacity: Number(busCapacity)
      };
      await AddBusToDatabase(newBus);
      handleSuccessOperation()
    } catch (err) {
      setError('Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    // Check if any field is empty
    if (!busName.trim() || !busCapacity || !busPlate.trim()) {
      return setError("الرجاء قم بتعبئة جميع المعلومات المطلوبة");
    }

    // Validate bus capacity (must be a valid number and greater than 0)
    if (isNaN(busCapacity) || parseInt(busCapacity) <= 0) {
      return setError('يرجى إدخال سعة حافلة رقم صحيح');
    }

    // Validate bus plate format
    if (!plateRegex.test(busPlate)) {
      return setError('تنسيق لوحة الحافلة غير صحيح. يجب أن تكون مكونة من 3 أحرف تليها3 او 4 أرقام');
    }

    // If all validations pass, proceed to add bus
    addBus(busName, busCapacity, busPlate);
  };
  const handleSuccessOperation = () => {
    setShowSuccess(false); 
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => navigate('/busList'), 2000); // Navigate after 2 seconds
    }, 0);
  };

  return (
    <div className="add-bus-page">
       {showSuccess && <SuccessMessage message="تم إضافة حافلة بنجاح" />}
      <Sidebar />
      <div className="add-bus-main">
        <Header />
        <div className="bus-detail-buttons">
          <button className='edit-bus-button' onClick={() => navigate('/busList')}>عودة</button> 
        </div>
        <div className="add-bus-content">
          <FormContainer>
            <div className="title-container">
              <h1>إضافة حافلة جديدة</h1>
              <div className="line"></div>
            </div>
            <form onSubmit={handleSubmit} className="add-bus-form">
              <div className="form-group">
                <label htmlFor="busName" className="form-label">
                  اسم الحافلة
                  <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="busName"
                  className="form-input"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  placeholder="اسم او وصف الحافلة"
                  
                />

                <label htmlFor="busCapacity" className="form-label">
                  سعة الحافلة
                  <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  id="busCapacity"
                  className="form-input"
                  value={busCapacity}
                  onChange={(e) => setBusCapacity(e.target.value)}
                  placeholder="الحد الاعلى لسعة الحافلة"
                  
                />

                <label htmlFor="busPlate" className="form-label">
                  لوحة الحافلة
                  <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="busPlate"
                  className="form-input"
                  value={busPlate}
                  onChange={(e) => setBusPlate(e.target.value)}
                  placeholder="XXX0000"
                  
                />
                <p style={{marginTop:'1px', color:'#555'}}> تنسيق الوحة الحافلة يجب أن يكون مكون من 3 من أحرف تليها 3 او 4 أرقام </p>
              </div>

              {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>} {/* Global error message */}

              <div className="button-area">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>جاري الاضافة <CgSpinnerAlt style={{ marginRight: '2px' }} className='spinner' /></>
                  ) : 'اضافة'}
                </button>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default AddBus;