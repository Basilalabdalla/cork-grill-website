import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminSiteSettingsPage = () => {
  const [openingHours, setOpeningHours] = useState({ weekdays: '', weekends: '' });
  const [popularItemIds, setPopularItemIds] = useState([]);
  const [allItems, setAllItems] = useState([]); // To list all available menu items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { adminInfo } = useAuth();

  // Fetch initial site settings and all menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [homeContentRes, menuItemsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/homepage`),
          fetch(`${import.meta.env.VITE_API_URL}/api/menu`),
        ]);
        const homeContentData = await homeContentRes.json();
        const menuItemsData = await menuItemsRes.json();

        setOpeningHours(homeContentData.openingHours || { weekdays: '', weekends: '' });
        setPopularItemIds(homeContentData.popularItemIds.map(item => item._id) || []);
        setAllItems(menuItemsData);
      } catch (err) {
        setError('Failed to load site settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePopularItemToggle = (itemId) => {
    if (popularItemIds.includes(itemId)) {
      setPopularItemIds(popularItemIds.filter(id => id !== itemId));
    } else {
      setPopularItemIds([...popularItemIds, itemId]);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homepage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: JSON.stringify({ openingHours, popularItemIds }),
      });
      if (!response.ok) throw new Error('Failed to save settings.');
      alert('Settings saved successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      
      {/* Opening Hours Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Opening Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Weekdays</label>
            <input 
              type="text" 
              value={openingHours.weekdays}
              onChange={(e) => setOpeningHours({ ...openingHours, weekdays: e.target.value })}
              className="p-2 border rounded w-full" 
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Weekends</label>
            <input 
              type="text" 
              value={openingHours.weekends}
              onChange={(e) => setOpeningHours({ ...openingHours, weekends: e.target.value })}
              className="p-2 border rounded w-full" 
            />
          </div>
        </div>
      </div>

      {/* Popular Items Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Most Popular Items</h2>
        <p className="text-sm text-gray-600 mb-4">Select items to feature on the homepage carousel.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allItems.map(item => (
            <div key={item._id} className="flex items-center">
              <input 
                type="checkbox" 
                id={`popular-${item._id}`}
                checked={popularItemIds.includes(item._id)}
                onChange={() => handlePopularItemToggle(item._id)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor={`popular-${item._id}`} className="ml-2">{item.name}</label>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={handleSave} 
        className="mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
      >
        Save All Settings
      </button>
    </div>
  );
};

export default AdminSiteSettingsPage;