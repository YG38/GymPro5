import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check session storage on mount
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const role = sessionStorage.getItem('role');
    const email = sessionStorage.getItem('email');
    const userName = sessionStorage.getItem('userName');

    // Clear all session data if any required field is missing
    if (!token || !role || !email) {
      sessionStorage.clear();
      setUser(null);
      return;
    }

    // Restore user state from session
    setUser({ token, role, email, name: userName });
  }, []);

  // Login function to set user data
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function to clear user data and session
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
