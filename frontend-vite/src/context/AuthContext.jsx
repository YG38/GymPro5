import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const role = sessionStorage.getItem('role');
    const email = sessionStorage.getItem('email');

    if (token && role && email) {
      setUser({ token, role, email });
    }
    setLoading(false);
  }, []);

  // Login function to set user data
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('authToken', userData.token);
    sessionStorage.setItem('role', userData.role);
    sessionStorage.setItem('email', userData.email);
  };

  // Logout function to clear user data
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');
  };

  if (loading) {
    return null; // or a loading spinner
  }

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
