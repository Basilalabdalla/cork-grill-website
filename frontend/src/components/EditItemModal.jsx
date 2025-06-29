import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EditItemModal = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const { adminInfo } = useAuth();

  // When the 'item' prop changes, update the form data
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
      });
    }
  }, [item]);

  if (!item) return null; // Don't render the modal if no item is selected

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5002/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update item');
      
      const updatedItem = await response.json();
      onUpdate(updatedItem); // Pass the updated item back to the parent
      onClose(); // Close the modal

    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Content */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input name="name" type="text" value={formData.name} onChange={handleChange} className="p-2 border rounded w-full" />
            <input name="price" type="number" value={formData.price} onChange={handleChange} className="p-2 border rounded w-full" step="0.01" />
            <input name="imageUrl" type="text" value={formData.imageUrl} onChange={handleChange} className="p-2 border rounded w-full" />
            <textarea name="description" value={formData.description} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;