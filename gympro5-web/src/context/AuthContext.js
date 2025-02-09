import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Correct useNavigate import
import { login } from "../api/api"; // Ensure 'login' exists in `api.js`

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const loginUser = async (credentials) => {
        try {
            const response = await login(credentials);
            setUser(response.user);
            navigate("/dashboard"); // Redirect after login
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logoutUser = () => {
        setUser(null);
        navigate("/login"); // Redirect to login after logout
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Correctly export useAuth hook
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
