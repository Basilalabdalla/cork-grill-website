import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const ItemDetailModal = ({ item, onClose, isStoreOpen }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({}); // To store user's choices

  // Reset state when a new item is selected
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedOptions({});
    }
  }, [item]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (item) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [item]);

  if (!item) return null;

  // --- LOGIC FOR CUSTOMIZATIONS ---
  const handleOptionChange = (groupTitle, option, groupType, maxSelections) => {
    setSelectedOptions(prev => {
      const newSelections = { ...prev };
      const currentGroupSelections = newSelections[groupTitle] || [];

      if (groupType === 'SINGLE') {
        newSelections[groupTitle] = [option];
      } else { // MULTIPLE
        if (currentGroupSelections.some(o => o.name === option.name)) {
          // Deselect
          newSelections[groupTitle] = currentGroupSelections.filter(o => o.name !== option.name);
        } else if (currentGroupSelections.length < maxSelections) {
          // Select
          newSelections[groupTitle] = [...currentGroupSelections, option];
        }
      }
      return newSelections;
    });
  };

  // --- CALCULATE FINAL PRICE ---
  const optionsPrice = Object.values(selectedOptions)
    .flat()
    .reduce((total, option) => total + (option.price || 0), 0);
  const totalPrice = (item.price + optionsPrice) * quantity;
  
  // --- HANDLE ADDING TO CART ---
  const handleAddToCart = () => {
    const finalItem = {
      ...item,
      // Add a unique ID for the cart based on selections
      cartId: `${item._id}-${JSON.stringify(selectedOptions)}`, 
      selectedOptions,
      price: item.price + optionsPrice // The final price per unit
    };
    addToCart(finalItem, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-lg rounded-t-2xl max-h-[90vh] flex flex-col">
            <header className="relative">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" />
              <button onClick={onClose} className="absolute top-4 right-4 bg-white rounded-full p-2 text-2xl leading-none shadow-md">×</button>
            </header>

            <div className="p-6 overflow-y-auto">
              <h2 className="text-3xl font-bold">{item.name}</h2>
              <p className="text-gray-600 mt-2">{item.description}</p>
              
              {/* --- RENDER CUSTOMIZATION GROUPS --- */}
              {item.customizationGroups?.map((group, groupIndex) => (
                <div key={groupIndex} className="mt-6 border-t pt-4">
                  <h3 className="text-xl font-semibold">{group.title}</h3>
                  <div className="mt-2 space-y-2">
                    {group.options.map((option, optionIndex) => {
                      const isSelected = selectedOptions[group.title]?.some(o => o.name === option.name);
                      return (
                        <div key={optionIndex} onClick={() => handleOptionChange(group.title, option, group.type, group.maxSelections)} className="flex justify-between items-center p-3 rounded-lg border cursor-pointer">
                          <div>
                            <span className="font-medium">{option.name}</span>
                            {option.price > 0 && <span className="text-sm text-gray-500 ml-2">+€{option.price.toFixed(2)}</span>}
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                            {isSelected && <span className="text-white">✔</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-6 mt-auto border-t bg-gray-50">
              <div className="flex items-center justify-center gap-6 mb-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-2xl font-bold bg-gray-200 rounded-full w-10 h-10">-</button>
                <span className="text-2xl font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="text-2xl font-bold bg-gray-200 rounded-full w-10 h-10">+</button>
              </div>
              <button 
    onClick={handleAddToCart} 
    disabled={!isStoreOpen}
    className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    {isStoreOpen ? `Add ${quantity} to order for €${totalPrice.toFixed(2)}` : 'Currently unavailable'}
  </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailModal;