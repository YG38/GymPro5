import axios from "axios";

// Set the base URL depending on the environment (development or production)
const API = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? "http://localhost:5000/api" 
    : "https://gym-pro5.vercel.app", // Update with your production URL
});

// Attach JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry and logout automatically if token is expired
API.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized (token expired or invalid)
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// ---- Admin Endpoints ----

// Add a Gym with a Manager
export const addGymWithManager = async (gymData) => {
  try {
    const response = await API.post("/admin/gyms", gymData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

// Delete a Gym (cascades to manager/trainers)
export const deleteGym = async (gymId) => {
  try {
    const response = await API.delete(`/admin/gyms/${gymId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

// ---- Manager Endpoints ----

// Add a Trainer
export const addTrainer = async (trainerData) => {
  try {
    const response = await API.post("/manager/trainers", trainerData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

// Update Gym Prices
export const updatePrices = async (prices) => {
  try {
    const response = await API.put("/manager/prices", prices);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

// Update Gym Location
export const updateLocation = async (location) => {
  try {
    const response = await API.put("/manager/location", location);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

// ---- Trainer Endpoints ----

// Add a Workout Plan
export const addWorkoutPlan = async (planData) => {
  try {
    const response = await API.post("/trainer/workouts", planData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

// ---- Authentication ----

// Login
export const login = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
};

export default API;
