import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // To get the token
import { useNavigate } from 'react-router-dom'; // Import for logout redirect
import AddItemForm from '../components/AddItemForm';
import EditItemModal from '../components/EditItemModal';
import PromotionManager from '../components/PromotionManager';

const AdminDashboardPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { adminInfo, logout } = useAuth(); // Get admin info and logout function
  const navigate = useNavigate();

   // This function will be passed as a prop to the AddItemForm
  const handleNewItem = (newItem) => {
    // Add the newly created item to our list to update the UI instantly
    setMenuItems((prevItems) => [...prevItems, newItem]);
  };

  // Function to fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items when the component first loads
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // --- NEW: Handle Delete Function ---
  const handleDelete = async (itemId) => {
    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          // This is the crucial part: sending the token for authorization
          'Authorization': `Bearer ${adminInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item.');
      }

      // If successful, filter out the deleted item from the list to update the UI instantly
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
      alert('Item deleted successfully!');

    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
    // For now, this just clears the auth state.
  };

  const handleUpdateItem = (updatedItem) => {
    setMenuItems((prevItems) => 
      prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {adminInfo?.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <AddItemForm onNewItem={handleNewItem} />
        <PromotionManager />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Manage Menu</h2>
          {/* Table to display menu items */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
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
      </div>
      <EditItemModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} // Function to close the modal
          onUpdate={handleUpdateItem} // Function to handle the updated data
        />
    </>
  );
};

export default AdminDashboardPage;