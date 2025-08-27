import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, total } = useCart();
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!customerDetails.name) tempErrors.name = "Name is required.";
    if (!customerDetails.phone) {
        tempErrors.phone = "Phone number is required.";
    } else if (!/^0[0-9]{9}$/.test(customerDetails.phone)) {
        // Simple Irish phone validation: starts with 0, followed by 9 digits
        tempErrors.phone = "Please enter a valid 10-digit phone number starting with 0.";
    }
    if (customerDetails.email && !/\S+@\S+\.\S+/.test(customerDetails.email)) {
        tempErrors.email = "Please enter a valid email address.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, customer: customerDetails }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create order.');
      
      if (data.paymentUrl) window.location.href = data.paymentUrl;
    } catch (err) {
      setErrors({ form: err.message });
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
        <div className="text-center p-10">
            <h1 className="text-2xl font-bold">Your cart is empty.</h1>
            <button onClick={() => navigate('/')} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded">Back to Menu</button>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-lg p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Order Summary</h2>
        {/* ... (Order summary JSX from your Cart component can be reused here) ... */}
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.cartId} className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-bold">{item.qty} x {item.name}</p>
                {/* Display selected options */}
                <div className="text-sm text-gray-500 pl-2">
                  {Object.entries(item.selectedOptions || {}).map(([group, options]) => (
                    <div key={group}>
                      {options.map(opt => <p key={opt.name}>- {opt.name}</p>)}
                    </div>
                  ))}
                </div>
              </div>
              <p className="font-semibold">€{(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        {/* Subtotal, Discount, and Total */}
        <div className="space-y-1 mt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-€{discountAmount.toFixed(2)}</span></div>}
            <div className="font-bold text-lg flex justify-between mt-2 border-t pt-2"><span>Total</span><span>€{total.toFixed(2)}</span></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Details</h2>
        {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}
        <div className="space-y-4">
          <div>
            <input type="text" name="name" placeholder="Full Name *" value={customerDetails.name} onChange={handleChange} className={`p-3 border rounded w-full ${errors.name ? 'border-red-500' : ''}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input type="tel" name="phone" placeholder="Phone Number *" value={customerDetails.phone} onChange={handleChange} className={`p-3 border rounded w-full ${errors.phone ? 'border-red-500' : ''}`} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <input type="email" name="email" placeholder="Email (Optional, for receipt)" value={customerDetails.email} onChange={handleChange} className={`p-3 border rounded w-full ${errors.email ? 'border-red-500' : ''}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-green-700 disabled:bg-gray-400">
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;