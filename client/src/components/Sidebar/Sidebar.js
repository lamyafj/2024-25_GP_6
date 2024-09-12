import { Link } from 'react-router-dom';
import './Sidebar.css';
import { SidebarData } from './SidebarData';

export const Sidebar = () => {
  return (
    <div className='Sidebar'>
      {SidebarData.map((val, key) => (
        <div key={key} className='sidebarItem'>
          <Link to={val.link}>
          <div className='icon'>{val.icon}</div> 
           <div className='title'>{val.title}</div>
          </Link>
        </div>
      ))}
      
    </div>
  );
};
