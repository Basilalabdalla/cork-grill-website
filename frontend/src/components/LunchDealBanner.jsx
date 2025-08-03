import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LunchDealBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour >= 11 && currentHour < 14) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    checkTime();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-green-600 text-white font-bold text-center overflow-hidden"
        >
          <p className="py-3">🎉 Lunch Deal is on! All burgers can be upgraded to a meal deal! 🎉</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LunchDealBanner;