import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import CustomizationManager from './CustomizationManager.jsx'; // <-- THIS WAS THE MISSING IMPORT
import imageCompression from 'browser-image-compression';

const AddItemForm = ({ onNewItem, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [customizationGroups, setCustomizationGroups] = useState([]);
  const { adminInfo } = useAuth();

  useEffect(() => {
    if (categories && categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');
    const options = { maxSizeMB: 9.5, maxWidthOrHeight: 1920, useWebWorker: true };
    try {
      console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      setImageFile(compressedFile);
    } catch (error) {
      setError("Could not process image. Please try another one.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!imageFile) return setError('Please select an image.');

    try {
      setUploading(true);
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminInfo.token}` },
        body: imageFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed');
      
      const validCustomizationGroups = customizationGroups.filter(group => group.title.trim() !== '');

      const newItemData = {
        name,
        description,
        price,
        category,
        imageUrl: uploadData.imageUrl,
        customizationGroups: validCustomizationGroups,
      };

      const createRes = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
        body: JSON.stringify(newItemData),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.message || 'Failed to create menu item');

      onNewItem(createData);
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setCategory(categories[0]?.name || '');
      setImageFile(null);
      setCustomizationGroups([]);
      if(document.getElementById('add-image-upload')) {
        document.getElementById('add-image-upload').value = null;
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Add New Menu Item</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border rounded" required step="0.01" />
        <div className="md:col-span-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded w-full" required>
            <option value="" disabled>Select a category</option>
            {categories && categories.map(cat => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Item Image</label>
          <input id="add-image-upload" type="file" onChange={handleFileChange} className="p-2 border rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
        </div>
        <div className="md:col-span-2">
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded w-full" required />
        </div>
      </div>

      <CustomizationManager groups={customizationGroups} setGroups={setCustomizationGroups} />

      <button type="submit" className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Add Item'}
      </button>
    </form>
  );
};

export default AddItemForm;