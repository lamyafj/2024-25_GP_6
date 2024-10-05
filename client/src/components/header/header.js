import './header.css';
import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { SchoolRecordContext } from '../../context/UserContext';

const Header = () => {
  const { schoolRecord } = useContext(SchoolRecordContext); // Access context
  const schoolCode = schoolRecord?.schoolCode; // Safely access schoolCode

  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-icon">
          <FaUser size={24} className="icon" style={{ marginRight: '10px', color: 'grey' }} />
        </div>
        <div className="divider"></div>
        <div className="header-details">
          {schoolCode ? (
            <h2 className="header-title">{schoolCode}</h2>
          ) : (
            <h2 className="header-title">No School Code Available</h2>
          )}
          <p className="header-subtitle">قسم نقل الحافلات</p>
        </div>
      </div>
    </div>
  );
};

export default Header;


        /* Uncomment for actions */
        /* <div className="header-actions">
          <input type="checkbox" />
          <button className="notification-button">🔔</button>
          <button className="three-dots-button">⋮</button>
        </div> */