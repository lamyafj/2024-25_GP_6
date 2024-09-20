
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { baseURL, LOGOUT } from '../../Api/Api';
import axios from 'axios'; // Import axios

// handleLogout.js
// programmatic navigation
  
  const HandleLogout = async (navigate) => { 
    //const navigate = useNavigate(); 
    try {
      const response = await fetch(`${baseURL}/${LOGOUT}`, {
        method: 'POST',
        credentials: 'include', // Important to include cookies in the request
      });

      if (response.ok) {
        // Clear session, then redirect to login page
        navigate('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

export default HandleLogout;
