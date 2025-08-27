import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const ItemDetailModal = ({ item, onClose, isStoreOpen }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedOptions({});
      setValidationError('');
    }
    document.body.style.overflow = item ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [item]);

  if (!item) return null;

  const handleOptionChange = (group, option) => {
    setValidationError(''); // Clear validation error on any change
    setSelectedOptions(prev => {
      const newSelections = { ...prev };
      const currentGroupSelections = newSelections[group.title] || [];
      const isAlreadySelected = currentGroupSelections.some(o => o.name === option.name);
      if (group.type === 'SINGLE') {
        newSelections[group.title] = isAlreadySelected ? [] : [option];
      } else {
        if (isAlreadySelected) {
          newSelections[group.title] = currentGroupSelections.filter(o => o.name !== option.name);
        } else if (currentGroupSelections.length < group.maxSelections) {
          newSelections[group.title] = [...currentGroupSelections, option];
        }
      }
      return newSelections;
    });
  };

  const optionsPrice = Object.values(selectedOptions).flat().reduce((total, option) => total + (option.price || 0), 0);
  const totalPrice = (item.price + optionsPrice) * quantity;
  const unlockedGroupTitles = Object.values(selectedOptions).flat().flatMap(option => option.unlocksGroups || []);

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleAddToCart = () => {
    setValidationError('');
    const visibleGroups = item.customizationGroups.filter(group => {
      const isPrimary = !item.customizationGroups.some(g => g.options.some(o => o.unlocksGroups?.includes(group.title)));
      const isUnlocked = unlockedGroupTitles.includes(group.title);
      return isPrimary || isUnlocked;
    });

    for (const group of visibleGroups) {
      const selections = selectedOptions[group.title] || [];
      // This is a simple required check. More complex logic could be added (e.g. a 'required' flag in the DB)
      if (selections.length === 0) {
        setValidationError(`Please make a selection for "${group.title}".`);
        return; // Stop if validation fails
      }
    }
    
    // Define finalItem here, AFTER validation passes
    const finalItem = {
      ...item,
      cartId: `${item._id}-${JSON.stringify(selectedOptions)}`,
      selectedOptions,
      price: item.price + optionsPrice
    };
    
    addToCart(finalItem, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-lg rounded-t-2xl max-h-[90vh] flex flex-col">
            <header className="relative"><img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" /><button onClick={onClose} className="absolute top-4 right-4 bg-white rounded-full p-2 text-2xl leading-none shadow-md">&times;</button></header>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-3xl font-bold">{item.name}</h2>
              <p className="text-gray-600 mt-2">{item.description}</p>
              {item.customizationGroups?.map((group, groupIndex) => {
                const isPrimaryGroup = !item.customizationGroups.some(g => g.options.some(o => o.unlocksGroups?.includes(group.title)));
                const isUnlocked = unlockedGroupTitles.includes(group.title);
                if (!isPrimaryGroup && !isUnlocked) return null;
                return (
                  <div key={groupIndex} className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center"><h3 className="text-xl font-semibold">{group.title}</h3><span className="text-sm font-medium text-gray-500">Required</span></div>
                    <div className="mt-2 space-y-2">{group.options.map((option, optionIndex) => { const isSelected = selectedOptions[group.title]?.some(o => o.name === option.name); return (<div key={optionIndex} onClick={() => handleOptionChange(group, option)} className="flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"><div><span className="font-medium">{option.name}</span>{option.price > 0 && <span className="text-sm text-gray-500 ml-2">+€{option.price.toFixed(2)}</span>}</div><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>{isSelected && <span className="text-white font-bold">✓</span>}</div></div>);})}</div>
                  </div>
                );
              })}
            </div>
            <footer className="p-6 mt-auto border-t bg-gray-50">
              {validationError && <p className="text-red-500 text-center text-sm mb-2">{validationError}</p>}
              <div className="flex items-center justify-center gap-6 mb-4"><button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-2xl font-bold bg-gray-200 rounded-full w-10 h-10">-</button><span className="text-2xl font-bold">{quantity}</span><button onClick={() => setQuantity(q => q + 1)} className="text-2xl font-bold bg-gray-200 rounded-full w-10 h-10">+</button></div>
              <button onClick={handleAddToCart} disabled={!isStoreOpen} className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed">{isStoreOpen ? `Add ${quantity} to order for €${totalPrice.toFixed(2)}` : 'Currently unavailable'}</button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailModal;