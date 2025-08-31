import { useState, useEffect, useRef } from 'react';

const CategoryNavbar = ({ categories, activeCategory }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navRef = useRef(null); // Ref to the container of the buttons

  const handleSelectCategory = (categoryName) => {
    const element = document.getElementById(categoryName);
    if (element) {
      // We calculate the offset to account for the sticky navbar itself
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // We calculate how far down the page the user has scrolled
      const position = window.scrollY;
      setScrollPosition(position);
    };

    // Add the scroll listener when the component mounts
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="sticky top-[64px] bg-white/90 backdrop-blur-md shadow-sm py-3 z-20 overflow-hidden">
      {/* We use the scrollPosition state to apply a CSS transform */}
      <div
        ref={navRef}
        className="flex items-center gap-2 sm:gap-4 px-4 transition-transform duration-300 ease-out"
        // This line moves the container left/right based on scroll position.
        // The numbers can be tweaked to make the effect faster or slower.
        style={{ transform: `translateX(-${scrollPosition / 15}px)` }}
      >
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleSelectCategory(category.name)}
            className={`px-4 py-2 font-semibold rounded-full transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === category.name
                ? 'bg-orange-500 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNavbar;