import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AddItemForm from '../components/admin/AddItemForm.jsx';
import EditItemModal from '../components/admin/EditItemModal.jsx';

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  const { adminInfo } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/menu`),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
        ]);
        if (!menuRes.ok || !catRes.ok) throw new Error('Failed to fetch data');
        
        const menuData = await menuRes.json();
        const catData = await catRes.json();

        setMenuItems(menuData);
        setCategories(catData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleNewItem = (newItem) => setMenuItems((prev) => [...prev, newItem]);
  const handleUpdateItem = (updatedItem) => setMenuItems((prev) => prev.map(item => item._id === updatedItem._id ? updatedItem : item));

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminInfo.token}` },
      });
      if (!res.ok) throw new Error('Failed to delete item');
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-8">Menu Management</h1>
        <AddItemForm onNewItem={handleNewItem} categories={categories} />
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-4">Current Menu</h2>
          
          {/* --- THIS IS THE FIX --- */}
          {/* We wrap the table in a div that allows horizontal scrolling on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">€{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setEditingItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* --- END OF FIX --- */}
          
        </div>
      </div>
      <EditItemModal 
        item={editingItem} 
        onClose={() => setEditingItem(null)}
        onUpdate={handleUpdateItem}
        categories={categories}
      />
    </>
  );
};

export default AdminMenuPage;