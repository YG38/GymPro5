import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure your backend is running on this URL
});

// Attach JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Admin Endpoints ----

// Add a Gym with a Manager
export const addGymWithManager = async (gymData) => {
  try {
    const response = await API.post("/admin/gyms", gymData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a Gym (cascades to manager/trainers)
export const deleteGym = async (gymId) => {
  try {
    const response = await API.delete(`/admin/gyms/${gymId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ---- Manager Endpoints ----

// Add a Trainer
export const addTrainer = async (trainerData) => {
  try {
    const response = await API.post("/manager/trainers", trainerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Gym Prices
export const updatePrices = async (prices) => {
  try {
    const response = await API.put("/manager/prices", prices);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Gym Location
export const updateLocation = async (location) => {
  try {
    const response = await API.put("/manager/location", location);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ---- Trainer Endpoints ----

// Add a Workout Plan
export const addWorkoutPlan = async (planData) => {
  try {
    const response = await API.post("/trainer/workouts", planData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ---- Authentication ----

// Login
export const login = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default API;
