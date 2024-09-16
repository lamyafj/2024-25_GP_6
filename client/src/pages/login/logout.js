// src/components/LogoutButton.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LogoutButton = () => {
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      alert('You have been logged out');
      // Optionally handle additional state changes or UI updates
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
