// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem('token');
  // console.log('Stored token:', storedToken);
  
  const payload = decodeToken(storedToken);
  // console.log('Decoded token payload:', payload);

  if (payload) {
    const adminCheck = payload.role === 'admin';
    // console.log('Is Admin:', adminCheck);
    setIsAdmin(adminCheck);
  } else {
    console.log('No valid payload found');
  }
  setLoading(false);
}, []);


const login = (newToken) => {
  setToken(newToken);
  localStorage.setItem('token', newToken);
  const payload = decodeToken(newToken);
  if (payload) setIsAdmin(payload.role === 'admin');
};

  function decodeToken(token) {
  if (!token) return null;
  
  try {
    // Replace URL-safe chars with Base64 standard ones
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Token decoding error:', e);
    return null;
  }
}


  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        login, 
        logout, 
        isAdmin,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);