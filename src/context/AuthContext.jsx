import React, { createContext, useState, useContext, useEffect } from 'react';
import { isLoggedIn, login as authLogin, logout as authLogout } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminAuthed, setAdminAuthed] = useState(isLoggedIn());

  const handleLogin = () => {
    authLogin();
    setAdminAuthed(true);
  };

  const handleLogout = () => {
    authLogout();
    setAdminAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ adminAuthed, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);