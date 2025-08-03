import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Check on initial load if consent has already been given
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
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
              <p className="text-gray-600 text-sm mt-1">We use technologies, such as cookies, to personalise advertising and content. Click "Accept Cookies" to agree to the use of these technologies.</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <button onClick={handleAccept} className="bg-yellow-400 hover:bg-yellow-500 font-bold py-2 px-6 rounded-md transition-colors">
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