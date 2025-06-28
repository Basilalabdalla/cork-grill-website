import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- Protected Admin Routes --- */}
        <Route path="/admin" element={<ProtectedRoute />}>
          {/* Any route nested inside here is now protected */}
          <Route path="dashboard" element={<AdminDashboardPage />} />
          {/* We can add more protected routes here later, e.g., /admin/menu-editor */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;