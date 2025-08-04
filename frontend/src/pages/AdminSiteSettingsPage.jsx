import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import TwoFactorSetup from '../components/admin/TwoFactorSetup.jsx';
import CategoryManager from '../components/admin/CategoryManager.jsx';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { adminInfo } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (newPassword !== confirmPassword) {
            return setError("New passwords do not match.");
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message || 'Failed to change password');
            setMessage(data.message);
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch(err) {
            setError(err.message);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <div className="space-y-4">
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="p-2 border rounded w-full"/>
                    <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="p-2 border rounded w-full"/>
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="p-2 border rounded w-full"/>
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">Change Password</button>
            </form>
        </div>
    );
}

const AdminSiteSettingsPage = () => {
  const [openingHours, setOpeningHours] = useState({ weekdays: '', weekends: '' });
  const [popularItemIds, setPopularItemIds] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { adminInfo } = useAuth();
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [homeContentRes, menuItemsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/homepage`),
          fetch(`${import.meta.env.VITE_API_URL}/api/menu`),
        ]);
        if (!homeContentRes.ok || !menuItemsRes.ok) throw new Error('Failed to load settings data.');
        
        const homeContentData = await homeContentRes.json();
        const menuItemsData = await menuItemsRes.json();

        setOpeningHours(homeContentData.openingHours || { weekdays: '', weekends: '' });
        setPopularItemIds(homeContentData.popularItemIds.map(item => item._id) || []);
        setAllItems(menuItemsData);
        setIsStoreOpen(homeContentData.isStoreOpen ?? true); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePopularItemToggle = (itemId) => {
    setPopularItemIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    try {
      // --- NEW: Add 'isStoreOpen' to the data being saved ---
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homepage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
        body: JSON.stringify({ openingHours, popularItemIds, isStoreOpen }),
      });
      if (!response.ok) throw new Error('Failed to save settings.');
      alert('Settings saved successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-6">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Operational Status</h2>
        <div className="flex items-center gap-4">
          <p className={`font-bold text-lg ${isStoreOpen ? 'text-green-600' : 'text-red-600'}`}>
            {isStoreOpen ? 'Store is currently OPEN' : 'Store is currently CLOSED'}
          </p>
          <button
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isStoreOpen ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isStoreOpen ? 'translate-x-6' : 'translate-x-1'}`}/>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Use this toggle to accept or pause incoming online orders.</p>
      </div>
      
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
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`popular-${item._id}`} className="ml-2 text-sm text-gray-700">{item.name}</label>
            </div>
          ))}
        </div>
      </div>
      <CategoryManager />
      <button 
        onClick={handleSave} 
        className="mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg"
      >
        Save All Settings
      </button>
      <TwoFactorSetup />
      <ChangePassword />
    </div>
  );
};

export default AdminSiteSettingsPage;