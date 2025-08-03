import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This logic still works. It checks if ANY choice has been made.
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Save 'accepted' state and hide banner
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  // --- NEW: Handler for the reject button ---
  const handleReject = () => {
    // Save 'rejected' state and hide banner
    localStorage.setItem('cookie_consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-6 z-50"
        >
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">Your data. Your choice.</h3>
              <p className="text-gray-600 text-sm mt-1">We use cookies to enhance your experience and for personalized advertising. Click "Accept" to agree to their use.</p>
            </div>
            {/* --- THIS IS THE UPDATED BUTTONS SECTION --- */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button 
                onClick={handleReject} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
              >
                Reject All
              </button>
              <button 
                onClick={handleAccept} 
                className="bg-yellow-400 hover:bg-yellow-500 font-bold py-2 px-6 rounded-md transition-colors"
              >
                Accept Cookies
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;