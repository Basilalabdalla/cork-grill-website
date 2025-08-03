import React from 'react';
import { motion } from 'framer-motion';

const MenuItemRow = ({ item, onSelect, isStoreOpen }) => {
  return (
    <motion.div
      onClick={isStoreOpen ? () => onSelect(item) : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`flex items-start gap-4 py-4 border-b border-gray-200 ${isStoreOpen ? 'cursor-pointer hover:bg-gray-50' : 'opacity-60'}`}
    >
      {/* Text Content (grows to fill space) */}
      <div className="flex-1">
        <h3 className="font-bold text-base md:text-lg text-gray-800">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        <p className="text-gray-800 font-semibold mt-2">€{item.price.toFixed(2)}</p>
      </div>

      {/* Image and Add Button (fixed size) */}
      <div className="flex-shrink-0 ml-4">
        <div className="relative">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md" />
          )}
          <div 
            className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
            aria-label={`Add ${item.name} to order`}
          >
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening when clicking the '+'
                    if(isStoreOpen) onSelect(item);
                }}
                disabled={!isStoreOpen}
                className="bg-white rounded-full p-1 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemRow;