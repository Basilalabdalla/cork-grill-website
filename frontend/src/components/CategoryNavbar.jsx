import React from 'react';

const CategoryNavbar = ({ categories, activeCategory }) => {
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

  return (
    <nav className="sticky top-[64px] bg-white/90 backdrop-blur-md shadow-sm py-3 z-20">
      <div className="container mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto px-4 hide-scrollbar">
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