import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');

    if (token && username) {
      setUser({ token, username, role, fullName });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password
      });
      
      const { token, role, fullName } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName || '');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({ token, username, role, fullName });
      return { success: true, role };
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return { success: false, message: 'Cannot connect to server. Please try again later.' };
      }
      if (error.response && error.response.status === 401) {
        return { success: false, message: 'Invalid username or password' };
      }
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (username, password, role, email, fullName) => {
    try {
      console.log('Sending registration request:', { username, role, email, fullName });
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        password,
        role: role || 'ROLE_USER',
        email,
        fullName
      });
      
      console.log('Registration response:', response.data);
      
      const { token, role: userRole } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', userRole);
      localStorage.setItem('fullName', fullName || '');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({ token, username, role: userRole, fullName });
      return { success: true, role: userRole };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return { success: false, message: 'Cannot connect to server. Please try again later.' };
      }
      if (error.response) {
        if (error.response.status === 400) {
          return { success: false, message: 'Username already exists. Please choose a different username.' };
        }
        return { success: false, message: error.response.data?.message || 'Registration failed' };
      }
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
