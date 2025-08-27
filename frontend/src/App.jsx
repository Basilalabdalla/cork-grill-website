import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

// Providers
import { CartProvider } from './context/CartContext.jsx';

// Core Layouts & Components
import PublicLayout from './components/PublicLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

// Page Components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import TwoFactorAuthPage from './pages/TwoFactorAuthPage.jsx'; // Make sure this is imported
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminMenuPage from './pages/AdminMenuPage.jsx';
import AdminPromotionsPage from './pages/AdminPromotionsPage.jsx';
import AdminSiteSettingsPage from './pages/AdminSiteSettingsPage.jsx';

// This is a special layout component that provides the CartContext
// to all the public pages that need it.
const CartLayout = () => (
  <CartProvider>
    <Outlet />
  </CartProvider>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes will have the main header, footer, and cookie banner */}
        <Route element={<PublicLayout />}>
          {/* These specific routes also need the cart functionality */}
          <Route element={<CartLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          {/* The About Us page doesn't need the cart, so it's separate */}
          <Route path="/about" element={<AboutUsPage />} />
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
    </Router>
  );
}

export default App;