import './header.css'; // Importing the CSS for styling
import React, { useContext } from 'react'; // Importing React and useContext
import { FaUser, FaCog } from 'react-icons/fa'; // Importing user and settings icons
import { SchoolRecordContext } from '../../context/UserContext'; // Context to access school record

const Header = ({ toggleSettingsForm }) => {
  const { schoolRecord } = useContext(SchoolRecordContext); // Accessing the school record context
  const schoolCode = schoolRecord?.schoolCode; // Safely accessing the school code

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
        {/* Settings Icon */}
        <div className="header-settings-icon" onClick={toggleSettingsForm} title="Settings">
          <FaCog size={24} style={{ cursor: 'pointer', color: 'grey' }} />
        </div>
      </div>
    </div>
  );
};

export default Header;
