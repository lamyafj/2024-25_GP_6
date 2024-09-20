import { Link } from 'react-router-dom';
import './Sidebar.css';
import { SidebarData } from './SidebarData';
import HandleLogout from '../../pages/login/handleLogout'
import { useNavigate } from 'react-router-dom';


export const Sidebar = () => {
  const navigate = useNavigate(); // Hook should be used in the functional component

  const logout = async (e) => {
    e.preventDefault();
    try {
      await HandleLogout(navigate); // Pass the navigate function to HandleLogout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className='Sidebar'>
    <div className='SidebarLogo'>
    <img src="../Maslakbus.png" alt="Logo" style={{ width:'60px', marginTop: '10px' }} />
    <img src="../MaslakName.png" alt="MaslakName" style={{ width: '90px', marginTop: '10px' }} />
      </div>
      {SidebarData.map((val, key) => (
        <div key={key} className='sidebarItem'>
          <Link to={val.link} className='sidebarLink'>
     <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className='title'>{val.title}</div>
    <div className='icon'>{val.icon}</div>

  </div>
</Link>

        </div>
      ))}
     <button onClick={logout}>Logout</button>
    </div>
  );
};

