import { Link } from 'react-router-dom';
import './Sidebar.css'

export const Sidebar = () => {
  return (
    <div className='Sidebar'>
    <nav >
      <Link to="/login">تسجيل دخول</Link>
    </nav>
    </div>
  );
};
