import React from 'react';
import './header.css';
import { FaUser } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-icon">
          <FaUser size={24} className="icon" style={{ marginRight: '10px', color: 'grey' }}  />
        </div>
        <div className="divider"></div>
        <div className="header-details">
          <h2 className="header-title">اسم المدرسة</h2>
          <p className="header-subtitle">مدير القسم</p>
        </div>
        {/* Uncomment for actions */}
        {/* <div className="header-actions">
          <input type="checkbox" />
          <button className="notification-button">🔔</button>
          <button className="three-dots-button">⋮</button>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
