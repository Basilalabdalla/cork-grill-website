import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import CustomizationManager from './CustomizationManager'; // <-- IMPORT

const AddItemForm = ({ onNewItem, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [customizationGroups, setCustomizationGroups] = useState([]); // <-- NEW STATE
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { adminInfo } = useAuth();

  useEffect(() => {
    if (categories && categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!imageFile) return setError('Please select an image.');

    try {
      setUploading(true);
      // ... (Image upload logic is the same)
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${adminInfo.token}` }, body: imageFormData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed');
      
      // --- UPDATE THE PAYLOAD ---
      const newItemData = {
        name,
        description,
        price,
        category,
        imageUrl: uploadData.imageUrl,
        customizationGroups, // <-- ADD CUSTOMIZATIONS
      };

      const createRes = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
        body: JSON.stringify(newItemData),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.message || 'Failed to create item');
      onNewItem(createData);
      
      // Reset form
      setName(''); setDescription(''); setPrice(''); setImageFile(null); setCustomizationGroups([]);
      if(document.getElementById('add-image-upload')) document.getElementById('add-image-upload').value = null;

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Add New Menu Item</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ... (Name, Price, Category inputs are the same) ... */}
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border rounded" required step="0.01" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded" required>
            <option value="" disabled>Select a category</option>
            {categories && categories.map(cat => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
        </select>
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Item Image</label>
          <input id="add-image-upload" type="file" onChange={(e) => setImageFile(e.target.files[0])} className="p-2 border rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
        </div>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded md:col-span-2 lg:col-span-3" required />
      </div>

      {/* --- ADD THE CUSTOMIZATION MANAGER --- */}
      <CustomizationManager groups={customizationGroups} setGroups={setCustomizationGroups} />

      <button type="submit" className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Add Item'}
      </button>
    </form>
  );
};

export default AddItemForm;