import './header.css'; // Importing the CSS for styling
import React, { useContext } from 'react'; // Importing React and useContext
import { FaUser, FaCog } from 'react-icons/fa'; // Importing user and settings icons
import { SchoolRecordContext } from '../../context/UserContext'; // Context to access school record
import { useNavigate } from 'react-router-dom'; 
import { IoSettingsOutline } from "react-icons/io5";

const Header = ({ toggleSettingsForm }) => {
  const { schoolRecord } = useContext(SchoolRecordContext); // Accessing the school record context
  const schoolUid = schoolRecord?.uid; // Safely accessing the school code
  const schoolname = schoolRecord?.schoolName
  const navigate = useNavigate();

  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-icon">
          {/* <FaUser size={24} className="icon" style={{ marginRight: '10px', color: 'grey' }} /> */}
        </div>
        <div className="divider"></div>
        <div className="header-details">
          {schoolUid ? (
            <h2 className="header-title">{schoolname}</h2>
          ) : (
            <h2 className="header-title">No School Code Available</h2>
          )}
          <p className="header-subtitle">{schoolUid}</p>
        </div>
        {/* Settings Icon */}
                <button 
          className="header-settings-icon" 
          onClick={() => navigate('/setting')} 
          title="Settings" 
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <IoSettingsOutline size={20} style={{ marginTop:'5px',color: 'grey' }} />
        </button>

      </div>
    </div>
  );
};

export default Header;
