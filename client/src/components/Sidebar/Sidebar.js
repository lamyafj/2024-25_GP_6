import { Link } from 'react-router-dom';
import './Sidebar.css';
import { SidebarData } from './SidebarData';




export const Sidebar = () => {
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
      
    </div>
  );
};

