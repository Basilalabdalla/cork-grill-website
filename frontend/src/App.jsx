import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

// Providers
import { CartProvider } from './context/CartContext.jsx';

// Core Components
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CookieBanner from './components/CookieBanner.jsx';

// Page Components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// Admin Components and Pages
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminMenuPage from './pages/AdminMenuPage.jsx';
import AdminPromotionsPage from './pages/AdminPromotionsPage.jsx';
import AdminSiteSettingsPage from './pages/AdminSiteSettingsPage.jsx';
import TwoFactorAuthPage from './pages/TwoFactorAuthPage.jsx';

const PublicLayout = () => (
  <CartProvider>
    <Outlet /> 
  </CartProvider>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* --- Public Routes --- */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/verify-2fa" element={<TwoFactorAuthPage />} />

            {/* --- CORRECTED ADMIN ROUTE STRUCTURE --- */}
            <Route element={<ProtectedRoute />}>
              {/* All routes nested inside here will be protected */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* These child routes will be rendered inside AdminLayout's <Outlet> */}
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="menu" element={<AdminMenuPage />} />
                <Route path="promotions" element={<AdminPromotionsPage />} />
                <Route path="settings" element={<AdminSiteSettingsPage />} />
              </Route>
            </Route>

          </Routes>
        </main>
        
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;