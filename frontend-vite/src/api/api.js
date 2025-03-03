import axios from "axios";

// Create axios instance with proxy-aware base URL
const API = axios.create({
  baseURL: process.env.NODE_ENV === "development"
    ? "http://localhost:5000"  // Set this to the local backend URL during development
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
    const response = await API.post("/api/gyms/gym", gymData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Add timeout and detailed error handling
      timeout: 15000,  // 15 seconds
      transformRequest: [function (data, headers) {
        // Ensure FormData is sent correctly
        return data;
      }]
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
    
    // Enhanced error handling with detailed error parsing
    if (error.response) {
      // Handle detailed validation errors
      if (error.response.data.details) {
        const detailedErrors = error.response.data.details;
        const errorMessages = Object.entries(detailedErrors)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join('; ');
        
        throw new Error(errorMessages || 'Validation failed');
      }

      // Fallback to generic server error
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
  }
};

export const deleteGym = async (gymId) => {
  try {
    const response = await API.delete(`/api/web/gym/${gymId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGyms = async () => {
  try {
    console.log('🏋️ FETCHING GYMS - START');
    const timestamp = new Date().toISOString();
    console.log('Fetch Timestamp:', timestamp);

    const response = await API.get("/api/gyms/gym");
    
    console.log('🏋️ FETCH GYMS RESPONSE:', response);
    return response.data;
  } catch (error) {
    console.error('❌ Error Fetching Gyms:', error);
    throw error;
  }
};

export const updateGym = async (gymId, gymData) => {
  try {
    const response = await API.put(`/api/web/gym/${gymId}`, gymData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGymById = async (gymId) => {
  try {
    const response = await API.get(`/api/web/gym/${gymId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 👨‍💼 Manager Endpoints
export const addTrainer = async (gymId, trainerData) => {
  try {
    const response = await API.post(`/api/trainer`, {
      gymId,
      ...trainerData
    });
    return response;
  } catch (error) {
    console.error('Error adding trainer:', error);
    throw error;
  }
};

export const updatePrices = async (prices) => {
  try {
    const response = await API.put("/api/manager/prices", prices);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLocation = async (location) => {
  try {
    const response = await API.put("/api/manager/location", location);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🏋️‍♂️ Trainer Endpoints
export const addWorkoutPlan = async (planData) => {
  try {
    const response = await API.post("/api/trainer/workouts", planData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔐 Authentication
export const login = async (credentials) => {
  try {
    const response = await API.post("/api/auth-web/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await API.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
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
    console.error('❌ Error Fetching Trainees:', error);
    throw error;
  }
};

export const fetchTrainers = async (gymId) => {
  try {
    const response = await API.get(`/api/trainer/${gymId}/trainers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWorkoutPlansByGym = async (gymId) => {
  try {
    const response = await API.get(`/api/gym/${gymId}/workout-plans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 👥 Manager Fetching
export const fetchManagers = async () => {
  try {
    console.log('👥 FETCHING MANAGERS - START');
    const response = await API.get("/api/gyms/managers");
    
    console.log('Fetched managers:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error Fetching Managers:', error);
    throw error;
  }
};

// ❌ Delete Operations
export const deleteTrainer = async (trainerId) => {
  try {
    const response = await API.delete(`/api/trainer/${trainerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainee = async (traineeId) => {
  try {
    const response = await API.delete(`/api/gyms/trainees/${traineeId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error Deleting Trainee:', error);
    throw error;
  }
};

export const deleteWorkoutPlan = async (planId) => {
  try {
    const response = await API.delete(`/api/workouts/${planId}`);
    return response.data;
  } catch (error) {
    throw error;
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
