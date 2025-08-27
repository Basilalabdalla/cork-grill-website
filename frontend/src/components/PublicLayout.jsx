import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import BackToTopButton from './BackToTopButton.jsx';
import CookieBanner from './CookieBanner.jsx';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
      <CookieBanner />
    </div>
  );
};

export default PublicLayout;