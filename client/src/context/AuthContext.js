import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebaseConfig'; // Import Firebase config
import { onAuthStateChanged } from 'firebase/auth';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to access auth context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component to provide auth context to the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Holds the current user
  const [loading, setLoading] = useState(true); // Loading state to manage initial auth check

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user if logged in
      } else {
        setUser(null); // Set user to null if not logged in
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    // Clean up the subscription to auth state changes
    return () => unsubscribe();
  }, []);

  // Context value to be passed to consumers
  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is done */}
    </AuthContext.Provider>
  );
}
