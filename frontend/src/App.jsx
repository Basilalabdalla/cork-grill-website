import { useState, useEffect } from 'react';
import { useCart } from './context/CartContext'; // <-- IMPORT useCart
import Cart from './components/Cart'; // <-- IMPORT Cart component

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart(); // <-- GET addToCart FUNCTION

  useEffect(() => {
    // ... (fetchMenuItems function is the same, no changes needed here)
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/menu');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading menu...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Cork Grill Menu</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Items Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:w-3/4">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <img 
                  src={`https://picsum.photos/seed/${item._id}/600/400`} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{item.name}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-bold text-green-600">€{item.price.toFixed(2)}</p>
                    <button 
                      onClick={() => addToCart(item)} // <-- ADD ONCLICK HANDLER
                      className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Section */}
          <div className="lg:w-1/4">
            <div className="sticky top-8"> {/* Makes the cart stay in view on scroll */}
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;