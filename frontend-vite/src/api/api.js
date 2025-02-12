import axios from "axios";

// Create axios instance with proxy-aware base URL
const API = axios.create({
  baseURL: process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"  // Set this to the local backend URL during development
    : "https://gym-pro5.vercel.app", // Set this to the production backend URL
  withCredentials: true,
});

// Request interceptor for auth headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      config: error.config,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(
      error.response?.data?.message || "An unexpected error occurred."
    );
  }
);

// WebSocket helper
export const createWebSocket = (path) => {
  const base = process.env.NODE_ENV === "development" 
    ? window.location.origin.replace(/^http/, 'ws') + '/api'
    : 'wss://gym-pro5.vercel.app';
  return new WebSocket(`${base}${path}`);
};

// 🏛️ Admin Endpoints
export const addGymWithManager = async (gymData) => {
  try {
    // Log the data being sent
    console.log('Sending gym data:', {
      gymName: gymData.get('gymName'),
      location: gymData.get('location'),
      price: gymData.get('price'),
      managerName: gymData.get('managerName'),
      managerEmail: gymData.get('managerEmail'),
      // Don't log password for security
    });

    const response = await API.post("/web/gym", gymData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in addGymWithManager:', error.response || error);
    throw error;
  }
};

export const deleteGym = async (gymId) => {
  try {
    const response = await API.delete(`/gym/${gymId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGyms = async () => {
  try {
    const response = await API.get("/gym");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGym = async (gymId, gymData) => {
  try {
    const response = await API.put(`/gym/${gymId}`, gymData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGymById = async (gymId) => {
  try {
    const response = await API.get(`/gym/${gymId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 👨‍💼 Manager Endpoints
export const addTrainer = async (trainerData) => {
  try {
    const response = await API.post("/manager/trainers", trainerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePrices = async (prices) => {
  try {
    const response = await API.put("/manager/prices", prices);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLocation = async (location) => {
  try {
    const response = await API.put("/manager/location", location);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🏋️‍♂️ Trainer Endpoints
export const addWorkoutPlan = async (planData) => {
  try {
    const response = await API.post("/trainer/workouts", planData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔐 Authentication
export const login = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 📦 Data Fetching
export const fetchTrainees = async () => {
  try {
    const response = await API.get("/trainees");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTrainers = async (gymId) => {
  try {
    const response = await API.get(`/gym/${gymId}/trainers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWorkoutPlansByGym = async (gymId) => {
  try {
    const response = await API.get(`/gym/${gymId}/workout-plans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ❌ Delete Operations
export const deleteTrainer = async (trainerId) => {
  try {
    const response = await API.delete(`/trainers/${trainerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainee = async (traineeId) => {
  try {
    const response = await API.delete(`/trainees/${traineeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkoutPlan = async (planId) => {
  try {
    const response = await API.delete(`/workouts/${planId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🚪 Logout
export const logout = (navigate) => {
  localStorage.removeItem("token");
  if (navigate) navigate("/login");
};

export default API;
