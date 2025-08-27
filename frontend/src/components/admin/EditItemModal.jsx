import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import CustomizationManager from './CustomizationManager.jsx';

const EditItemModal = ({ item, onClose, onUpdate, categories }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [customizationGroups, setCustomizationGroups] = useState([]);
  const { adminInfo } = useAuth();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
      });
      setCustomizationGroups(item.customizationGroups || []);
      setImageFile(null);
    }
  }, [item]);

  if (!item || !formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = formData.imageUrl;
    try {
      setUploading(true);
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${adminInfo.token}` }, body: uploadFormData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed');
        finalImageUrl = uploadData.imageUrl;
      }

      const validCustomizationGroups = customizationGroups.filter(group => group.title && group.title.trim() !== '');
      const finalData = { ...formData, imageUrl: finalImageUrl, customizationGroups: validCustomizationGroups };

      const updateRes = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminInfo.token}` },
        body: JSON.stringify(finalData),
      });

      if (!updateRes.ok) throw new Error('Failed to update item');
      
      const updatedItem = await updateRes.json();
      if (!updateRes.ok) throw new Error(updatedItem.message || 'Failed to update item');
      
      onUpdate(updatedItem);
      alert('Success! The item has been updated.'); // SUCCESS MESSAGE
      onClose();

    } catch (error) {
      console.error('Update error:', error);
      alert(`Error: ${error.message}`); // ERROR MESSAGE WITH REASON
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit: {item.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} className="p-2 border rounded" />
            <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="p-2 border rounded" step="0.01" />
            <select name="category" value={formData.category} onChange={handleChange} className="md:col-span-2 p-2 border rounded w-full" required>
              {categories && categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Change Image (Optional)</label>
                <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 border rounded w-full md:col-span-2" />
          </div>

          <CustomizationManager groups={customizationGroups} setGroups={setCustomizationGroups} />

          <div className="flex justify-end gap-4 mt-6 border-t pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;