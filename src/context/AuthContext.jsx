import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');
  const [loading, setLoading] = useState(false); // already loaded once from localStorage

  const login = (newToken, role) => {
    setToken(newToken);
    setIsAdmin(role === 'admin');

    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
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
