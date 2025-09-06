import { Route, Routes, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import ALL your layouts and pages
import PublicLayout from './PublicLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import AboutUsPage from '../pages/AboutUsPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import OrderConfirmationPage from '../pages/OrderConfirmationPage.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import AdminMenuPage from '../pages/AdminMenuPage.jsx';
import AdminPromotionsPage from '../pages/AdminPromotionsPage.jsx';
import AdminSiteSettingsPage from '../pages/AdminSiteSettingsPage.jsx';
import TwoFactorAuthPage from '../pages/TwoFactorAuthPage.jsx'; // Make sure this is imported

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* The key is CRITICAL. It tells AnimatePresence that the entire route tree has changed. */}
      <Routes location={location} key={location.pathname}>
        
        {/* --- Public Routes --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderConfirmationPage />} />
        </Route>
        
        {/* --- Standalone Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/verify-2fa" element={<TwoFactorAuthPage />} />

        {/* --- Protected Admin Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="settings" element={<AdminSiteSettingsPage />} />
          </Route>
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;