import React from 'react';
import './Busltem.css';
import { FaUser } from 'react-icons/fa';

const BusItem = () => {
  return (
    <div className="bus-item-container">
      <div className="bus-item-content">
        <div className="bus-item-icon">
          <FaUser size={24} style={{ marginRight: '10px', color: 'grey' }} />
        </div>
        <div className="divider"></div> 
        <div className="bus-item-details">
          <h2 className="bus-item-title">اسم المرسة</h2>
          <p className="bus-item-subtitle">  مدير القسم</p>
        </div>
        <div className="bus-item-actions">
          <input type="checkbox" />
          <button className="notification-button">🔔</button>
          <button className="three-dots-button">⋮</button>
        </div>
      </div>
    </div>
  );
};

export default BusItem;
