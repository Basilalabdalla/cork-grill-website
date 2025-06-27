import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook to use the context easily
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Check if the item is already in the cart
    const exist = cartItems.find((x) => x._id === item._id);
    if (exist) {
      // If it exists, update its quantity
      setCartItems(
        cartItems.map((x) =>
          x._id === item._id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      // If it's a new item, add it to the cart with quantity 1
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  // We'll add removeFromCart and other functions later

  const value = {
    cartItems,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};