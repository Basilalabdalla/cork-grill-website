import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate

// --- Reusable Icon Components (No change here) ---
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );
const CartIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> );

// This component contains the display logic for the cart's content.
const CartContent = ({ onCheckout, onClose }) => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, discountAmount, bestPromotion, total } = useCart();
  return (
    <>
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Your Order</h2>{onClose && <button onClick={onClose} className="text-2xl font-semibold">&times;</button>}</div>
      {cartItems.length === 0 ? <p className="text-gray-500">Your cart is empty.</p> : <>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">{cartItems.map(item => (<div key={item.cartId} className="flex justify-between items-center text-sm"><div><p className="font-bold">{item.name}</p><p className="text-gray-600">€{item.price.toFixed(2)}</p></div><div className="flex items-center gap-2"><button onClick={() => decreaseQuantity(item.cartId)} className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 font-bold">-</button><span>{item.qty}</span><button onClick={() => increaseQuantity(item.cartId)} className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 font-bold">+</button><button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 ml-2"><TrashIcon /></button></div></div>))}</div>
        <hr className="my-4" /><div className="space-y-2"><div className="flex justify-between"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>{bestPromotion && <div className="flex justify-between text-green-600"><span>Discount ({bestPromotion.name})</span><span>-€{discountAmount.toFixed(2)}</span></div>}<div className="flex justify-between font-bold text-xl pt-2 border-t"><span>Total</span><span>€{total.toFixed(2)}</span></div></div>
        <button onClick={onCheckout} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-green-700 transition-colors">Checkout</button>
      </>}
    </>
  );
};

// Main Cart component that handles the responsive logic
const Cart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, cartKey } = useCart();
  
  // --- THIS IS THE CORRECTED LOGIC ---
  const navigate = useNavigate(); // Initialize navigate hook

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false); // Close the modal on mobile before navigating
    navigate('/checkout'); // Navigate to the new checkout page
  };
  // ------------------------------------

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Desktop Sidebar (Rendered inside HomePage) */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 hidden lg:block">
        <CartContent onCheckout={handleCheckout} />
      </div>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-5 right-5 z-20">
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.button
              key={cartKey}
              onClick={() => setIsCartOpen(true)}
              initial={{ scale: 0 }}
              animate={{ scale: [1.2, 1] }} 
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-orange-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
            >
              <CartIcon />
              <span className="ml-2 font-bold">{totalItems}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-30 flex items-end justify-center p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="bg-white rounded-t-2xl p-6 w-full max-w-lg">
              <CartContent onCheckout={handleCheckout} onClose={() => setIsCartOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;