import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('auth');
    if (data) setUser(JSON.parse(data));
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    // expected res = { token: '...', user: { ... } }
    localStorage.setItem('auth', JSON.stringify(res));
    setUser(res);
    return res;
  };

  const register = async (payload) => {
    const res = await registerApi(payload);
    localStorage.setItem('auth', JSON.stringify(res));
    setUser(res);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
