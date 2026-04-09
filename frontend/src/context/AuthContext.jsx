import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [profileOverride, setProfileOverride] = useState(() => {
    const raw = localStorage.getItem('profileOverride');
    return raw ? JSON.parse(raw) : null;
  });
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
          ...(profileOverride || {}),
          ...decoded
        });
        
        fetchProfile(token);
      } catch (err) {
        console.error('Failed to decode token:', err);
        logout();
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('profileOverride');
      setUser(null);
      setLoading(false);
    }
  }, [token, profileOverride]);

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

  const login = (jwt, profile = null) => {
    setLoading(true);
    if (profile) {
      setProfileOverride(profile);
      localStorage.setItem('profileOverride', JSON.stringify(profile));
    }
    setToken(jwt);
  };

  const logout = () => {
    setToken(null);
    setProfileOverride(null);
    localStorage.removeItem('profileOverride');
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
