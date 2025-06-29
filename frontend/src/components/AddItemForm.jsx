import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddItemForm = ({ onNewItem }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { adminInfo } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("LOG 1: File selected ->", file);
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("LOG 2: Form submitted.");

    if (!imageFile) {
      const msg = "Please select an image file to upload.";
      console.error("LOG 3: No image file found.");
      setError(msg);
      return;
    }

    try {
      // --- Step 1: Upload Image ---
      setUploading(true);
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadUrl = `${import.meta.env.VITE_API_URL}/api/upload`;
      console.log("LOG 4: Uploading image to URL ->", uploadUrl);

      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminInfo.token}` },
        body: imageFormData,
      });

      console.log("LOG 5: Received upload response from server ->", uploadRes);
      
      const uploadData = await uploadRes.json();
      console.log("LOG 6: Parsed JSON from upload response ->", uploadData);
      
      setUploading(false);

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || 'Image upload failed in step 1');
      }
      
      if (!uploadData.imageUrl) {
          throw new Error("Server did not return an imageUrl after upload.");
      }

      // --- Step 2: Create Menu Item ---
      const newItemData = {
        name,
        description,
        price,
        imageUrl: uploadData.imageUrl,
      };

      console.log("LOG 7: Creating menu item with this data ->", newItemData);

      const createRes = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: JSON.stringify(newItemData),
      });
      
      console.log("LOG 8: Received create item response from server ->", createRes);

      const createData = await createRes.json();
      console.log("LOG 9: Parsed JSON from create item response ->", createData);
      
      if (!createRes.ok) {
        throw new Error(createData.message || 'Failed to create menu item in step 2');
      }
      
      onNewItem(createData);
      console.log("LOG 10: --- SUCCESS ---");
      
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      if (document.getElementById('image-upload')) {
        document.getElementById('image-upload').value = null;
      }

    } catch (err) {
      console.error("LOG 11: --- ERROR CAUGHT ---", err);
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Add New Menu Item</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border rounded" required step="0.01" />
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Image</label>
            <input id="image-upload" type="file" onChange={handleFileChange} className="p-2 border rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
        </div>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded md:col-span-2" required />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Add Item'}
      </button>
    </form>
  );
};

export default AddItemForm;