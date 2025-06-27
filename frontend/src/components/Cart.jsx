import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems } = useCart();
  
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Your Order</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-2">
              <span>{item.name} (x{item.qty})</span>
              <span>€{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;