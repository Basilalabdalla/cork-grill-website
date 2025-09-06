import { Outlet, useLocation } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import BackToTopButton from './BackToTopButton.jsx';
import CookieBanner from './CookieBanner.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const PublicLayout = () => {
  const location = useLocation();

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
              <Outlet />
        </main>
        <Footer />
        <BackToTopButton />
        <CookieBanner />
      </div>
    </CartProvider>
  );
};

export default PublicLayout;