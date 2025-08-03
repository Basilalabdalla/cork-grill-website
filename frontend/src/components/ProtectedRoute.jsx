import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { adminInfo, loading } = useAuth();

  // While we check for the user's session, we can show a loading message
  if (loading) {
    return <div>Loading session...</div>;
  }

  // If the user is logged in, render the child route (e.g., the AdminLayout).
  // The <Outlet /> is a placeholder for whatever nested route is matched.
  // If the user is not logged in, redirect them to the login page.
  return adminInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;