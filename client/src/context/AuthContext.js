import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '../pages/loading/loading';

const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading, true: authenticated, false: unauthenticated
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const idToken = Cookies.get('session'); 
      if (idToken) {
        try {
          const response = await axios.get('http://localhost:5000/api/protected-route', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
            withCredentials: true,
          });

          setIsAuthenticated(true);
          console.log('Decoded Claims:', response.data);
        } catch (error) {
          console.error('Error accessing protected route:', error);
          setIsAuthenticated(false); 
        }
      } else {
        setIsAuthenticated(false);
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    <Loading/>
  }

  return isAuthenticated === true ? children : null; 
};

export default RequireAuth;
