import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage");
      return [];
    }
  });
  const [promotions, setPromotions] = useState([]);
  const [cartKey, setCartKey] = useState(0); // This is our animation trigger

  useEffect(() => {
    // We save the current state of the cart to localStorage.
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => { 
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/promotions`);
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };
    fetchPromotions();
  }, []);

  const updateCartAndAnimate = (newCartItems) => {
    setCartItems(newCartItems);
    setCartKey(prevKey => prevKey + 1); // Trigger animation
  };

  const addToCart = (item, quantity = 1) => {
    const exist = cartItems.find((x) => x.cartId === item.cartId);
    let newCartItems;
    if (exist) {
      newCartItems = cartItems.map((x) => x.cartId === item.cartId ? { ...exist, qty: exist.qty + quantity } : x);
    } else {
      newCartItems = [...cartItems, { ...item, qty: quantity }];
    }
    updateCartAndAnimate(newCartItems);
  };

  const increaseQuantity = (cartId) => {
    const newCartItems = cartItems.map((x) => x.cartId === cartId ? { ...x, qty: x.qty + 1 } : x);
    updateCartAndAnimate(newCartItems);
  };

  const decreaseQuantity = (cartId) => {
    const exist = cartItems.find((x) => x.cartId === cartId);
    let newCartItems;
    if (exist.qty === 1) {
      newCartItems = cartItems.filter((x) => x.cartId !== cartId);
    } else {
      newCartItems = cartItems.map((x) => x.cartId === cartId ? { ...x, qty: x.qty - 1 } : x);
    }
    updateCartAndAnimate(newCartItems);
  };
  const removeFromCart = (cartId) => {
    const newCartItems = cartItems.filter((x) => x.cartId !== cartId);
    updateCartAndAnimate(newCartItems);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const now = new Date();
  const activePromotions = promotions.filter(p => new Date(p.startTime) <= now && new Date(p.endTime) >= now);
  
  let bestPromotion = null;
  if (activePromotions.length > 0) {
    bestPromotion = activePromotions.reduce((best, current) => 
      current.discountValue > best.discountValue ? current : best, 
      activePromotions[0]
    );
  }

  const discountAmount = bestPromotion ? (subtotal * bestPromotion.discountValue) / 100 : 0;
  const total = subtotal - discountAmount;

  const clearCart = () => {
    setCartItems([]);
    // The useEffect for localStorage will automatically handle saving the new empty array.
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });
      if (!response.ok) throw new Error('Failed to create payment link');
      const { paymentUrl } = await response.json();
      if (paymentUrl) window.location.href = paymentUrl;
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

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
    handleCheckout,
    cartKey,
    clearCart, // Ensure cartKey is provided
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};