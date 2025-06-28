import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  // Get both adminInfo AND the new loading state from our context
  const { adminInfo, loading } = useAuth();

  // --- THIS IS THE NEW LOGIC ---
  // 1. If we are still loading, don't render anything yet.
  //    You could also return a loading spinner component here.
  if (loading) {
    return null; // or <LoadingSpinner />
  }

  // 2. Once loading is false, then check for adminInfo.
  //    If it exists, show the protected content.
  //    If not, redirect to login.
  return adminInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;