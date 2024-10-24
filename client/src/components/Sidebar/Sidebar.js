import React, { useState } from 'react';
import { NavLink,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import './Sidebar.css';
import { SidebarData } from './SidebarData';
import HandleLogout from '../../pages/login/handleLogout';
import ConfirmationModal from '../Confirmation/confirm';

export const Sidebar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setModalOpen(false);
    try {
      await HandleLogout(navigate);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleLogout = () => {
    setModalOpen(true);
  };

  return (
    <div className='Sidebar'>
  <Link to="/adminDashboard" className='SidebarLogo'>
    <img src="../Maslakbus.png" alt="Logo" style={{ width: '60px', marginTop: '10px' }} />
    <img src="../MaslakName.png" alt="MaslakName" style={{ width: '90px', marginTop: '10px' }} />
  </Link>
      {SidebarData.map((val, key) => (
        <div key={key} className='sidebarItem'>
          <NavLink to={val.link} className='sidebarLink'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='title'>{val.title}</div>
              <div className='icon-sidebar'>{val.icon}</div>
            </div>
          </NavLink>
        </div>
      ))}
      <div id='logoutButtonDiv'>
        <button
          id='logoutButton'
          onClick={handleLogout}
        >
          تسجيل خروج
          <MdLogout style={{ color: "red", fontSize: '16px', marginLeft: '7px', verticalAlign: 'middle' }} />
        </button>

        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={logout}
          onClose={() => setModalOpen(false)}
        >
          هل انت متأكد برغبتك بتسجيل الخروج؟
        </ConfirmationModal>
      </div>
    </div>
  );
};
