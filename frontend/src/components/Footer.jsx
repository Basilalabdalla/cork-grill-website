import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [openingHours, setOpeningHours] = useState(null);

  useEffect(() => {
    // Fetch the homepage content to get the dynamic opening hours
    const fetchHours = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homepage`);
        const data = await response.json();
        if (response.ok) {
          setOpeningHours(data.openingHours);
        }
      } catch (error) {
        console.error("Failed to fetch opening hours for footer:", error);
      }
    };
    fetchHours();
  }, []);

  return (
    <>
      {/* --- Orange Section for Contact Info --- */}
      <footer className="bg-orange-500 text-white p-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="flex items-center mb-2">
              📞 021 432 29 32 / 085 252 6291
            </p>
            <p className="flex items-center">
              ✉️ contact@corkgrill.com
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Opening Hours</h3>
            {openingHours ? (
              <>
                <p>Weekdays: {openingHours.weekdays}</p>
                <p>Weekends: {openingHours.weekends}</p>
              </>
            ) : (
              <p>Loading hours...</p>
            )}
          </div>
        </div>
      </footer>

      {/* --- Black Section for Copyright and Links --- */}
      <div className="bg-gray-800 text-gray-400 p-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Cork Grill. All Rights Reserved.</p>
          <p className="text-sm mt-1">Made with ❤️ and ☕ by Basil Alabdalla.</p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link to="/" className="hover:text-white">Menu</Link>
            <span>|</span>
            <Link to="/about" className="hover:text-white">About</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;