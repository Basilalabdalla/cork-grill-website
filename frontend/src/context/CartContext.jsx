import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context, which will be the 'vessel' for our global state.
const CartContext = createContext();

// Create a custom hook for easy access to the context from any component.
export const useCart = () => {
  return useContext(CartContext);
};

// Create the Provider component. This component will wrap our application
// and manage all the state and logic for the cart and promotions.
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [promotions, setPromotions] = useState([]); // State to hold active promotions

  // --- EFFECT TO FETCH PROMOTIONS ---
  // This runs once when the application loads to get all available promotions.
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/promotions');
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
        } else {
          console.error('Failed to fetch promotions from server.');
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };
    fetchPromotions();
  }, []); // The empty dependency array means this effect runs only once on mount.

  // --- CORE CART FUNCTIONS ---

  const addToCart = (item) => {
    const exist = cartItems.find((x) => x._id === item._id);
    if (exist) {
      increaseQuantity(item._id);
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  const increaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    const exist = cartItems.find((x) => x._id === itemId);
    if (exist && exist.qty === 1) {
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item._id === itemId ? { ...item, qty: item.qty - 1 } : item
        )
      );
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };


  // --- DYNAMIC CALCULATIONS ---
  // These values are re-calculated every time the cartItems or promotions change.
  
  // 1. Calculate the base subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // 2. Determine the best active promotion
  const now = new Date();
  const activePromotions = promotions.filter(p => 
    new Date(p.startTime) <= now && new Date(p.endTime) >= now && p.isActive
  );
  
  let bestPromotion = null;
  if (activePromotions.length > 0) {
    // This logic finds the promotion with the highest discount percentage.
    // It can be expanded later to handle different types of promotions.
    bestPromotion = activePromotions.reduce(
      (best, current) => (current.discountValue > best.discountValue ? current : best),
      activePromotions[0]
    );
  }

  // 3. Calculate the discount amount
  let discountAmount = 0;
  if (bestPromotion) {
    discountAmount = (subtotal * bestPromotion.discountValue) / 100;
  }

  // 4. Calculate the final total
  const total = subtotal - discountAmount;

  // --- VALUE TO PROVIDE ---
  // This object bundles up all the state and functions to be provided to child components.
  const value = {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    bestPromotion,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};