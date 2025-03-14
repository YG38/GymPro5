import axios from "axios";

// Create a consistent API configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000  // 15 seconds timeout
});

// Centralized error handling
const handleApiError = (error) => {
  console.error('API Error:', {
    errorName: error.name,
    errorMessage: error.message,
    responseStatus: error.response?.status,
    responseData: error.response?.data
  });

  if (error.response) {
    // The request was made and the server responded with a status code
    throw new Error(
      error.response.data.error || 
      error.response.data.message || 
      'Server responded with an error'
    );
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response received from server. Check your network connection.');
  } else {
    // Something happened in setting up the request
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

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
    handleApiError(error);
    return Promise.reject(error);
  }
);

// WebSocket helper
export const createWebSocket = (path) => {
  const base = process.env.NODE_ENV === "development" 
    ? window.location.origin.replace(/^http/, 'ws')
    : 'wss://gym-pro5.vercel.app';
  return new WebSocket(`${base}${path}`);
};

// 🏛️ Admin Endpoints
export const addGymWithManager = async (gymData) => {
  try {
    // Comprehensive logging of form data
    console.group('🏋️ Gym API Submission');
    console.log('Submission Timestamp:', new Date().toISOString());
    
    // Log all form data keys for debugging
    for (let [key, value] of gymData.entries()) {
      // Mask sensitive information and handle file logging
      console.log(`FormData Key: ${key}, Value Type: ${typeof value}, Value: ${
        key === 'managerPassword' ? '********' : 
        (value instanceof File ? `File: ${value.name}, Size: ${value.size}, Type: ${value.type}` : value)
      }`);
    }

    // Validate price conversion
    const price = parseFloat(gymData.get('price'));
    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be a valid positive number');
    }
    gymData.set('price', price.toFixed(2));

    // Perform submission with enhanced configuration
    const response = await API.post("/gyms/gym", gymData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    console.log('Server Response:', response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.group('❌ Gym API Error');
    console.error('Detailed Error Information:', {
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      requestConfig: error.config
    });
    console.groupEnd();
    
    handleApiError(error);
  }
};

export const deleteGym = async (gymId) => {
  try {
    const response = await API.delete(`/gyms/${gymId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchGyms = async () => {
  try {
<<<<<<< HEAD
    console.log('🏋️ FETCHING GYMS - START');
    const timestamp = new Date().toISOString();
    console.log('Fetch Timestamp:', timestamp);

    const response = await API.get("/api/gyms/gym");
    
    console.log('🏋️ FETCH GYMS RESPONSE:', response);
    return response.data;
  } catch (error) {
    console.error('❌ Error Fetching Gyms:', error);
    throw error;
=======
    const response = await API.get('/gyms');
    return response.data;
  } catch (error) {
    handleApiError(error);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
  }
};

export const updateGym = async (gymId, gymData) => {
  try {
    const response = await API.put(`/gyms/${gymId}`, gymData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchGymById = async (gymId) => {
  try {
    const response = await API.get(`/gyms/${gymId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 👨‍💼 Manager Endpoints
export const addTrainer = async (gymId, trainerData) => {
  try {
    const response = await API.post(`/gyms/${gymId}/trainers`, trainerData);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const updatePrices = async (prices) => {
  try {
<<<<<<< HEAD
    const response = await API.put("/api/manager/prices", prices);
=======
    const response = await API.put("/prices", prices);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateLocation = async (location) => {
  try {
<<<<<<< HEAD
    const response = await API.put("/api/manager/location", location);
=======
    const response = await API.put("/location", location);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 🏋️‍♂️ Trainer Endpoints
export const addWorkoutPlan = async (planData) => {
  try {
<<<<<<< HEAD
    const response = await API.post("/api/trainer/workouts", planData);
=======
    const response = await API.post("/trainers/workouts", planData);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 🔐 Authentication
export const login = async (credentials) => {
  try {
    const response = await API.post("/api/auth-web/login", credentials);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await API.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 📦 Data Fetching
export const fetchTrainees = async () => {
  try {
    console.log('🏃 FETCHING TRAINEES - START');
    const response = await API.get("/api/gyms/trainees");
    
    console.log('🏃 Trainees Fetch Response:', response.data);
    return response.data;
  } catch (error) {
<<<<<<< HEAD
    console.error('❌ Error Fetching Trainees:', error);
    throw error;
=======
    handleApiError(error);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
  }
};

export const fetchTrainers = async (gymId) => {
  try {
<<<<<<< HEAD
    const response = await API.get(`/api/trainer/${gymId}/trainers`);
=======
    const response = await API.get(`/gyms/${gymId}/trainers`);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchWorkoutPlansByGym = async (gymId) => {
  try {
<<<<<<< HEAD
    const response = await API.get(`/api/gym/${gymId}/workout-plans`);
=======
    const response = await API.get(`/gyms/${gymId}/workout-plans`);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 👥 Manager Fetching
export const fetchManagers = async () => {
  try {
<<<<<<< HEAD
    console.log('👥 FETCHING MANAGERS - START');
    const response = await API.get("/api/gyms/managers");
    
    console.log('Fetched managers:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error Fetching Managers:', error);
    throw error;
=======
    const response = await API.get('/managers');
    return response.data;
  } catch (error) {
    handleApiError(error);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
  }
};

// ❌ Delete Operations
export const deleteTrainer = async (trainerId) => {
  try {
<<<<<<< HEAD
    const response = await API.delete(`/api/trainer/${trainerId}`);
=======
    const response = await API.delete(`/trainers/${trainerId}`);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteTrainee = async (traineeId) => {
  try {
    const response = await API.delete(`/api/gyms/trainees/${traineeId}`);
    return response.data;
  } catch (error) {
<<<<<<< HEAD
    console.error('❌ Error Deleting Trainee:', error);
    throw error;
=======
    handleApiError(error);
>>>>>>> aad843acb6cc602aa99fdc8f3a00c2bb76e0b8d1
  }
};

export const deleteWorkoutPlan = async (planId) => {
  try {
    const response = await API.delete(`/api/workouts/${planId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteManager = async (managerId) => {
  try {
    const response = await API.delete(`/api/gyms/managers/${managerId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error Deleting Manager:', error);
    throw error;
  }
};

// 🚪 Logout
export const logout = (navigate) => {
  localStorage.removeItem("token");
  if (navigate) navigate("/login");
};

// Fetch All Registered Users
export const fetchRegisteredUsers = async () => {
  try {
    console.log('👥 FETCHING REGISTERED USERS - START');
    const response = await API.get("/api/auth/users");
    
    console.log('👥 Registered Users Fetch Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error Fetching Registered Users:', error);
    throw error;
  }
};

export default API;
