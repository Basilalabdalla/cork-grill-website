import { useState, useEffect } from 'react';

function App() {
  // State to store the menu items fetched from the backend
  const [menuItems, setMenuItems] = useState([]);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch data from our backend API.
        // NOTE: The backend is on localhost:5002
        const response = await fetch('http://localhost:5002/api/menu');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMenuItems(data); // Store the data in state
      } catch (error) {
        setError(error.message); // Store any error message
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    fetchMenuItems();
  }, []); // The empty array [] means this effect runs only once

  // --- Display logic based on the state ---
  if (loading) {
    return <div className="p-4 text-center">Loading menu...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Cork Grill Menu</h1>
      
      {/* Grid container for menu items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          // The 'key' is crucial for React to identify each item
          <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <p className="text-xl font-semibold text-green-600">€{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;