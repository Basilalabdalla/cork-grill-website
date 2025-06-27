import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // This function is now just for adding the *first* instance of an item
  const addToCart = (item) => {
    const exist = cartItems.find((x) => x._id === item._id);
    if (!exist) {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    } else {
        // If it exists, just increase quantity
        increaseQuantity(item._id);
    }
  };

  // --- NEW: INCREASE QUANTITY ---
  const increaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((x) =>
        x._id === itemId ? { ...x, qty: x.qty + 1 } : x
      )
    );
  };

  // --- NEW: DECREASE QUANTITY ---
  const decreaseQuantity = (itemId) => {
    const exist = cartItems.find((x) => x._id === itemId);
    if (exist.qty === 1) {
      // If quantity is 1, remove the item completely
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((x) =>
          x._id === itemId ? { ...x, qty: x.qty - 1 } : x
        )
      );
    }
  };

  // --- NEW: REMOVE ITEM FROM CART ---
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((x) => x._id !== itemId));
  };


  // Provide all functions to the rest of the app
  const value = {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};