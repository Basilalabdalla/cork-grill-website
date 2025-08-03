import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { adminInfo } = useAuth();

  // The logic is now simple: if you have admin info, you're in. If not, you're out.
  // There's no "loading" state needed because the context initializes synchronously.
  return adminInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;