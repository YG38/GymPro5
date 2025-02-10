import React, { createContext, useContext, useState, useEffect } from "react";
import { login, logout } from "../api/api"; // Ensure correct imports
import { useNavigate } from "react-router-dom"; // Required for navigation

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginUser = async (credentials) => {
        try {
            const response = await login(credentials); // Call login API
            setUser(response.user);
            localStorage.setItem("user", JSON.stringify(response.user));
            navigate(`/${response.user.role}/dashboard`); // Redirect
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logoutUser = () => {
        logout();
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Correctly export useAuth
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
