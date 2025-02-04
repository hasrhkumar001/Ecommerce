import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  
  };
  

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    
  };

  return (
    <AuthContext.Provider value={{ authToken, logout, login}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
