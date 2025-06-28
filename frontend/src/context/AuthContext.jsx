import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true); // <-- NEW: Add loading state, default to true

  useEffect(() => {
    try {
      const storedAdminInfo = localStorage.getItem('adminInfo');
      if (storedAdminInfo) {
        setAdminInfo(JSON.parse(storedAdminInfo));
      }
    } catch (error) {
      console.error("Failed to parse admin info from localStorage", error);
      // Ensure state is clean if localStorage is corrupted
      setAdminInfo(null);
    } finally {
      // --- NEW: This is critical ---
      // After checking localStorage, set loading to false so the app can proceed.
      setLoading(false); 
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('adminInfo', JSON.stringify(data));
    setAdminInfo(data);
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
    setAdminInfo(null);
  };

  // Provide the new loading state along with the other values
  const value = { adminInfo, loading, login, logout }; // <-- NEW: Add loading to value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};