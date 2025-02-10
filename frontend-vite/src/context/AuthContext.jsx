import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: sessionStorage.getItem("authToken") || null,
    role: sessionStorage.getItem("role") || null,
  });

  const login = (authData) => {
    setAuthState(authData);
    sessionStorage.setItem("authToken", authData.token);
    sessionStorage.setItem("role", authData.role);
  };

  const logout = () => {
    setAuthState({ token: null, role: null });
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
