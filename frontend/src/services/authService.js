import axios from 'axios';

// Use environment variable for API base URL if available, otherwise default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      // Store token and user data (excluding password) in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data; // Contains token and user object
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    // Rethrow or return a structured error object
    throw error.response?.data || { message: 'Registration failed. Please try again.' };
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      // Store token and user data in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data; // Contains token and user object
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    // Rethrow or return a structured error object
    throw error.response?.data || { message: 'Login failed. Invalid credentials or server error.' };
  }
};

const logout = () => {
  // Remove token and user data from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
};

export default authService;

