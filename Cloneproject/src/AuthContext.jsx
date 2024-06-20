import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = (newToken, newRefreshToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      setToken(newAccessToken);
      console.log(newAccessToken);
      localStorage.setItem('token', newAccessToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  }, [refreshToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUser = storedToken ? JSON.parse(localStorage.getItem('user')) : false;

    

    if (storedToken && storedRefreshToken && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
