import axios from "axios";

// Create an axios instance with a base URL for development and production
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
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login on token expiry
    }
    return Promise.reject(error);
  }
);

// Fetch Trainers for a Specific Gym
export const fetchTrainers = async (gymId) => {
  try {
    const response = await API.get(`/gyms/${gymId}/trainers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a Trainer
export const deleteTrainer = async (trainerId) => {
  try {
    const response = await API.delete(`/trainers/${trainerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Example: Delete a trainee by their ID
export const deleteTrainee = async (traineeId) => {
  try {
    const response = await API.delete(`/trainees/${traineeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Example: Delete a Workout Plan by its ID
export const deleteWorkoutPlan = async (planId) => {
  try {
    const response = await API.delete(`/workouts/${planId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch Workout Plans for a specific gym
export const fetchWorkoutPlansByGym = async (gymId) => {
  try {
    const response = await API.get(`/gyms/${gymId}/workout-plans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🏛️ Admin Endpoints
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

// 👨‍💼 Manager Endpoints
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

// 🏋️‍♂️ Trainer Endpoints
export const addWorkoutPlan = async (planData) => {
  try {
    const response = await API.post("/trainer/workouts", planData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

// 🔐 Authentication
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

// Fetch Gyms
export const fetchGyms = async () => {
  try {
    const response = await API.get("/gyms");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch Trainees
export const fetchTrainees = async () => {
  try {
    const response = await API.get("/trainees");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout function (clears the token and redirects to login)
export const logout = (navigate) => {
  localStorage.removeItem("token");
  navigate("/login");
};

export default API;
