import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // --- THIS IS THE CRITICAL FIX ---
  // Initialize state directly from localStorage. This is a synchronous operation.
  const [adminInfo, setAdminInfo] = useState(() => {
    try {
      const storedInfo = localStorage.getItem('adminInfo');
      if (storedInfo) {
        const parsedInfo = JSON.parse(storedInfo);
        // Check if the session has expired (5 minutes)
        const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
if (new Date().getTime() - parsedInfo.loginTime < twoHours) {
          return parsedInfo;
        }
      }
      return null; // Return null if no stored info or if it's expired
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false); // We can remove the initial loading state

  const login = (data) => {
    // When logging in, add the current timestamp
    const sessionData = { ...data, loginTime: new Date().getTime() };
    localStorage.setItem('adminInfo', JSON.stringify(sessionData));
    setAdminInfo(sessionData);
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
    setAdminInfo(null);
  };

  // This effect will run in the background to check for session timeout
  useEffect(() => {
  const checkSession = () => {
    if (adminInfo) {
      const twoHours = 2 * 60 * 60 * 1000;
      if (new Date().getTime() - adminInfo.loginTime > twoHours) {
        logout();
      }
    }
  };
  const interval = setInterval(checkSession, 60 * 1000);
  return () => clearInterval(interval);
}, [adminInfo]);

  const value = { adminInfo, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};