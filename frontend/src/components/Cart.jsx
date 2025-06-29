import React from 'react';
import { useCart } from '../context/CartContext';

// Simple SVG Icon for the trash can
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

const Cart = () => {
  const { 
    cartItems, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart, 
    subtotal, 
    discountAmount, 
    bestPromotion, 
    total 
  } = useCart();

  // This function now expects a 'paymentUrl' from the backend and redirects to it.
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment link');
      }

      // The backend now sends an object like: { paymentUrl: 'https://...' }
      const { paymentUrl } = await response.json();

      // --- NEW LOGIC: Redirect the user to the Square Checkout page ---
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('Could not retrieve payment URL.');
      }

    } catch (error) {
      console.error('Checkout Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 border-b pb-4">Your Order</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-gray-600">€{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQuantity(item._id)} className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 font-bold">-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQuantity(item._id)} className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 font-bold">+</button>
                <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 ml-2">
                    <TrashIcon />
                </button>
              </div>
            </div>
          ))}
          <hr className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            {bestPromotion && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({bestPromotion.name})</span>
                <span>-€{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl pt-2 border-t">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout} 
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-green-700 transition-colors"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;