import { AddBusToDatabase } from './busListData';
import './addbus.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import Header from '../../components/header/header.js';
import { CgSpinnerAlt } from "react-icons/cg";

const AddBus = () => {
  const [busId, setBusId] = useState('');
  const [busCapacity, setBusCapacity] = useState('');
  const [busPlate, setBusPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addBus = async (busId,busCapacity,busPlate) => {
    try {
      setLoading(true);
      const newBus = { 
        id: busId,
        plate:busPlate,
        capacity:busCapacity,
      };
      await AddBusToDatabase(newBus);
      navigate('/buslist');
    } catch (err) {
      setError('Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busId.trim()) {
      addBus(busId,busCapacity,busPlate);
    } else {
      setError('Bus ID cannot be empty');
    }
  };

  return (
    <div className="add-bus-page">
      <Sidebar />
      <div className="add-bus-main">
      <Header/>
      <div className="bus-detail-buttons">
         <button className='edit-bus-button' onClick={() => navigate('/busList')}>عودة</button> 

         </div>
      <div className="add-bus-content">
        <FormContainer>
        <div class="title-container">
               <h1>إضافة حافلة جديدة</h1>
              <div class="line"></div>
              </div>
          <form onSubmit={handleSubmit} className="add-bus-form">
            
            <div className="form-group">
              <label htmlFor="busId" className="form-label">رقم الحافلة</label>
              <input
                type="text"
                id="busId"
                className="form-input"
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                placeholder="رقم الحافلة"
                required
              />
              <label htmlFor="busCapacity" className="form-label">سعة الحافلة</label>
              <input
                type="number"
                 min="0" step="1"
                id="busCapacity"
                className="form-input"
                value={busCapacity}
                onChange={(e) => setBusCapacity(e.target.value)}
                placeholder="سعة الحافلة"
                required
              />

              <label htmlFor="busPlate" className="form-label">لوحة الحافلة</label>
              <input
                type="text"
                id="busPlate"
                className="form-input"
                value={busPlate}
                onChange={(e) => setBusPlate(e.target.value)}
                placeholder="لوحة الحافلة"
                required
              />
            </div>
            <div className='button-area'>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <>جاري الاضافة <CgSpinnerAlt style={{marginRight:'2px'}}className='spinner'/> </> : 'اضافة'}
            </button>
            {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default AddBus;
