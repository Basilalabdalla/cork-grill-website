import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = "text-gray-600 hover:text-orange-500 font-semibold transition-colors";
  const activeLinkClass = "text-orange-500";

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-gray-800">
          Cork Grill
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Menu</NavLink>
          <NavLink to="/about" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>About Us</NavLink>
        </nav>

        {/* Mobile Menu Button ("Hamburger") */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4 6H4"></path></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <nav className="flex flex-col gap-4">
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Menu</NavLink>
            <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>About Us</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;