// API Configuration
const getApiBaseUrl = () => {
  // In production (Netlify), use environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://movie-ticket-backend.onrender.com';
  }
  // In development, use localhost
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();