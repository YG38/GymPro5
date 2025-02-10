import axios from "axios";

const API = axios.create({
  baseURL: process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://gym-pro5.vercel.app/api", // ✅ Ensure `/api` is included
});

// Attach JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Interceptor error:", err);
    }
    return Promise.reject(error);
  }
);

// ---- 🏛️ Admin Endpoints ----
export const addGymWithManager = async (gymData) => {
  try {
    const response = await API.post("/admin/gyms", gymData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

export const deleteGym = async (gymId) => {
  try {
    const response = await API.delete(`/admin/gyms/${gymId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

// ---- 👨‍💼 Manager Endpoints ----
export const addTrainer = async (trainerData) => {
  try {
    const response = await API.post("/manager/trainers", trainerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

export const updatePrices = async (prices) => {
  try {
    const response = await API.put("/manager/prices", prices);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

export const updateLocation = async (location) => {
  try {
    const response = await API.put("/manager/location", location);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

// ---- 🏋️‍♂️ Trainer Endpoints ----
export const addWorkoutPlan = async (planData) => {
  try {
    const response = await API.post("/trainer/workouts", planData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

// ---- 🔐 Authentication ----
export const login = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

export const register = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

export const logout = (navigate) => {
  localStorage.removeItem("token");
  navigate("/login"); // ✅ Use `navigate` instead of forcing a reload
};

export default API;
