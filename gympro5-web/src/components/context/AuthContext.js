import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On initial load, check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const expiryTime = localStorage.getItem("expiryTime");

    // If token, role, and expiryTime are valid and token is not expired, set user
    if (token && role && expiryTime && Date.now() < expiryTime) {
      setUser({ token, role });
    } else {
      logout(); // Logout if token is expired or not found
    }
  }, []);

  // Login function, accepts token, role, and expiry time
  const login = (token, role, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000; // Expiry time in milliseconds
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("expiryTime", expiryTime);
    setUser({ token, role });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("expiryTime");
    setUser(null);
  };

  // The context provider
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
