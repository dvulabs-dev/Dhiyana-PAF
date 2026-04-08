import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      
      try {
        const decoded = jwtDecode(token);
        // Assuming the JWT contains 'sub' (email) and 'roles'
        // If profile fetch fails, we still have the basic info from the token
        setUser({
          email: decoded.sub,
          roles: decoded.roles || [],
          ...decoded
        });
        
        fetchProfile(token);
      } catch (err) {
        console.error('Failed to decode token:', err);
        logout();
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async (jwt) => {
    try {
      const response = await axios.get('http://localhost:8080/api/profile', {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      // Merge profile info with role info from token
      setUser(prev => ({ ...prev, ...response.data }));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Don't logout immediately if token is valid but backend is down/denying profile
    } finally {
      setLoading(false);
    }
  };

  const login = (jwt) => {
    setLoading(true);
    setToken(jwt);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role) || user.roles.includes(`ROLE_${role}`);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
