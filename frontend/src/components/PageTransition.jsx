import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* The key is crucial. It tells AnimatePresence that its child has changed. */}
      <motion.div key={location.pathname}>
        {/* The children prop is where our actual page content will go */}
        {children}

        {/* --- The "Curtain" --- */}
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-white origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-white origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;