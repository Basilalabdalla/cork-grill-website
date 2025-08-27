import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const PromotionManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { adminInfo } = useAuth();

  // Fetch existing promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/promotions');
        if (!response.ok) throw new Error('Failed to fetch promotions.');
        const data = await response.json();
        setPromotions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: JSON.stringify({ name, description, discountValue, startTime, endTime, imageUrl, type: 'PERCENT_DISCOUNT' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create promotion');

      setPromotions([...promotions, data]); // Add to UI instantly
      // Clear form
      setName(''); setDescription(''); setDiscountValue(''); setStartTime(''); setEndTime(''); setImageUrl('');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDelete = async (promoId) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    try {
        await fetch(`http://localhost:5002/api/promotions/${promoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminInfo.token}` }
        });
        setPromotions(promotions.filter(p => p._id !== promoId));
    } catch(err) {
        setError(err.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Promotions</h2>
      
      {/* Add Promotion Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Create New Promotion</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Promotion Name" value={name} onChange={e => setName(e.target.value)} required className="p-2 border rounded" />
          <input type="number" placeholder="Discount %" value={discountValue} onChange={e => setDiscountValue(e.target.value)} required className="p-2 border rounded" />
          <div className="md:col-span-2">
        <input type="text" placeholder="Promotion Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="p-2 border rounded w-full" />
      </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required className="p-2 border rounded w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="p-2 border rounded w-full" />
          </div>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="p-2 border rounded md:col-span-2" />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Create Promotion</button>
      </form>
      
      {/* List of Promotions */}
      <div>
        <h3 className="text-xl font-bold mb-4">Active Promotions</h3>
        {loading ? <p>Loading...</p> : (
          <ul className="space-y-2">
            {promotions.map(promo => (
              <li key={promo._id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <div>
                  <p className="font-semibold">{promo.name} ({promo.discountValue}%)</p>
                  <p className="text-sm text-gray-600">{promo.description}</p>
                </div>
                <button onClick={() => handleDelete(promo._id)} className="text-red-600 hover:text-red-900">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PromotionManager;