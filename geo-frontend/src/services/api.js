import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for very slow backend
  headers: { 
    'Content-Type': 'application/json'
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`⏰ Request started at: ${new Date().toLocaleTimeString()}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log(`⏰ Response received at: ${new Date().toLocaleTimeString()}`);
    console.log(`📊 Response data:`, response.data);
    return response;
  },
  (error) => {
    console.error('=== API ERROR DETAILS ===');
    console.error('Error:', error);
    console.error('Response:', error.response);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('========================');
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      error.message = 'Resource not found';
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout after 60 seconds. Backend is taking too long to respond. Please try again or check if backend is running properly.';
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to backend. Is the server running on localhost:8000?';
    }
    
    return Promise.reject(error);
  }
);

// Retry function for failed requests
const retryRequest = async (fn, retries = 2, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET')) {
      console.log(`🔄 Retrying request... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const apiService = {
  // Main dashboard data
  async getDashboard() {
    console.log('🎯 Fetching dashboard with retry mechanism...');
    const response = await retryRequest(() => api.get('/'));
    return response.data;
  },

  // All news articles
  async getAllNews() {
    console.log('🎯 Fetching all news with retry mechanism...');
    const response = await retryRequest(() => api.get('/news'));
    return response.data;
  },

  // Category-specific news
  async getNews(category = null) {
    console.log(`🎯 Fetching news for category: ${category} with retry mechanism...`);
    const response = await retryRequest(() => api.get(category ? `/news/${category}` : '/news'));
    return response.data;
  },

  // Country-specific information
  async getCountry(countryName) {
    console.log(`🎯 Fetching country data for: ${countryName} with retry mechanism...`);
    const response = await retryRequest(() => api.get(`/country/${encodeURIComponent(countryName)}`));
    return response.data;
  },

  // All countries
  async getAllCountries() {
    const response = await api.get('/countries');
    return response.data;
  },

  // Analytics data
  async getAnalytics() {
    const response = await api.get('/analytics');
    return response.data;
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/');
      return { status: 'ok', data: response.data };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },

  // Generic GET request
  async get(url, config = {}) {
    const response = await api.get(url, config);
    return response.data;
  },

  // Generic POST request
  async post(url, data = {}, config = {}) {
    const response = await api.post(url, data, config);
    return response.data;
  },

  // Generic PUT request
  async put(url, data = {}, config = {}) {
    const response = await api.put(url, data, config);
    return response.data;
  },

  // Generic DELETE request
  async delete(url, config = {}) {
    const response = await api.delete(url, config);
    return response.data;
  }
};

export default apiService;
