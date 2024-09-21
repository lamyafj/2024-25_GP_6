import { baseURL, LOGOUT } from '../../Api/Api';


  const HandleLogout = async (navigate) => { 
    try {
      const response = await fetch(`${baseURL}/${LOGOUT}`, {
        method: 'POST',
        credentials: 'include', // Important to include cookies in the request
      });
      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

export default HandleLogout;
