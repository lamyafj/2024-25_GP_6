import { NavLink } from 'react-router-dom';
import './Path.css'

const Path = ({ first, second, third, fourth }) => {  
    return (
      <div className='path-css'>
        <NavLink 
        to={first} 
        className='path-link'></NavLink>
        <NavLink 
        to={second} 
        className='path-link'></NavLink>
      </div>
    );
  };
  
  
  export default Path;