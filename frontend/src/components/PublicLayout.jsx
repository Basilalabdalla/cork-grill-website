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
          {/* AnimatePresence handles the exit animation */}
          <AnimatePresence mode="wait">
            {/* The key is CRITICAL. It tells Framer Motion the page has changed. */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <BackToTopButton />
        <CookieBanner />
      </div>
    </CartProvider>
  );
};

export default PublicLayout;