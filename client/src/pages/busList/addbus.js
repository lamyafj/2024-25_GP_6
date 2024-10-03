import { AddBusToDatabase } from './busListData';
import './addbus.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';

const AddBus = () => {
  const [busId, setBusId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addBus = async (busId) => {
    try {
      setLoading(true);
      const newBus = { id: busId };
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
      addBus(busId);
    } else {
      setError('Bus ID cannot be empty');
    }
  };

  return (
    <div className="Addbus">
      <Sidebar />
      <div className="main">
        <FormContainer>
          <h2 className="form-title">Add a New Bus</h2>
          <form onSubmit={handleSubmit} className="add-bus-form">
            <div className="form-group">
              <label htmlFor="busId" className="form-label">Bus ID</label>
              <input
                type="text"
                id="busId"
                className="form-input"
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                placeholder="Enter Bus ID"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Bus'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </FormContainer>
      </div>
    </div>
  );
};

export default AddBus;
