import { createContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI } from '../services/api';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'salahelec_token';
const USER_KEY = 'salahelec_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      AuthAPI.profile()
        .then((response) => {
          // Store the user data in localStorage
          const userData = response.data;
          localStorage.setItem(USER_KEY, JSON.stringify({ 
            _id: userData._id, 
            name: userData.name, 
            email: userData.email, 
            role: userData.role 
          }));
          setUser(userData);
        })
        .catch(() => handleLogout());
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await AuthAPI.login(credentials);
      persistAuth(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setLoading(true);
    try {
      const response = await AuthAPI.register(payload);
      persistAuth(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const persistAuth = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    
    // Check if user data is directly in the response or nested
    const userData = data.user || data;
    
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ _id: userData._id, name: userData.name, email: userData.email, role: userData.role })
    );
    setUser({ _id: userData._id, name: userData.name, email: userData.email, role: userData.role });
    setToken(data.token);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      setUser
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

