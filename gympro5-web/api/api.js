import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
});

// Add JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin: Add Gym with Manager
export const addGymWithManager = async (gymData) => {
  return await API.post("/admin/gyms", gymData);
};

// Admin: Delete Gym (cascades to manager/trainers)
export const deleteGym = async (gymId) => {
  return await API.delete(`/admin/gyms/${gymId}`);
};

// Manager: Add Trainer
export const addTrainer = async (trainerData) => {
  return await API.post("/manager/trainers", trainerData);
};

// Manager: Update Gym Prices
export const updatePrices = async (prices) => {
  return await API.put("/manager/prices", prices);
};

// Manager: Update Gym Location
export const updateLocation = async (location) => {
  return await API.put("/manager/location", location);
};

// Trainer: Add Workout Plan
export const addWorkoutPlan = async (planData) => {
  return await API.post("/trainer/workouts", planData);
};

// Auth: Login
export const login = async (credentials) => {
  return await API.post("/auth/login", credentials);
};