import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const OrderConfirmationPage = () => {
  // useParams() gets the ':id' part from the URL /order/:id
  const { id } = useParams(); 
  
  // We need the clearCart function to empty the cart after a successful order
  const { clearCart } = useCart(); 
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`);
        if (!response.ok) {
          throw new Error('Could not find your order details.');
        }
        const data = await response.json();
        setOrder(data);
        
        // --- CRITICAL STEP ---
        // Once we have successfully loaded the order, we can safely clear the cart.
        clearCart();

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // The dependency array tells React to run this effect only when 'id' or 'clearCart' changes.
  }, [id, clearCart]);

  if (loading) {
    return <div className="text-center p-10 font-semibold text-lg">Loading your order confirmation...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-lg p-4 sm:p-8 text-center bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto animate-pulse">
          <span className="text-5xl text-green-600">✓</span>
        </div>
        <h1 className="text-3xl font-bold mt-6 text-gray-800">Thank You, {order?.customer.name}!</h1>
        <p className="text-gray-600 mt-2">Your order has been sent to the restaurant and is awaiting confirmation.</p>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Ready for Collection in 10-15 Minutes</h2>
          <p className="mt-4">Please give this code to the staff when you arrive:</p>
          <div className="my-4 text-6xl font-bold tracking-widest text-orange-500 p-4 rounded-lg">
            {order?.verificationCode}
          </div>
          <p className="text-sm text-gray-500">This is your unique pickup code for Order #{order?.squareOrderId.slice(-6)}</p>
        </div>
      </div>

      <Link to="/" className="inline-block mt-8 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-transform hover:scale-105">
        Back to Menu
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;