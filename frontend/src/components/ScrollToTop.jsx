import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component doesn't render any visible UI.
// Its only job is to run an effect when the URL changes.
const ScrollToTop = () => {
  // The 'pathname' variable will change every time you navigate to a new page.
  const { pathname } = useLocation();

  // The 'useEffect' hook will run every time 'pathname' changes.
  useEffect(() => {
    // This command instantly scrolls the window to the top left corner.
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this runs on every route change

  // Return null because we don't need to render anything.
  return null;
};

export default ScrollToTop;