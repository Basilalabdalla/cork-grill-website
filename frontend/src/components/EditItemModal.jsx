import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EditItemModal = ({ item, onClose, onUpdate }) => {
  // State for the form text fields
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  
  // State for the file upload process
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const { adminInfo } = useAuth();

  // This effect runs whenever the 'item' prop changes (i.e., when the modal is opened).
  // It populates the form with the data of the item being edited.
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
      });
      // Reset file input and errors when a new item is selected
      setImageFile(null); 
      setError('');
    }
  }, [item]);

  // Don't render anything if no item is selected for editing
  if (!item) {
    return null;
  }

  // Handles changes for all text-based inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles when a user selects a new file for the image
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let finalImageUrl = formData.imageUrl; // Default to the existing image URL

    try {
      // --- Step 1: Check if a new file has been selected ---
      if (imageFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);

        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${adminInfo.token}` },
          body: uploadFormData,
        });
        
        const uploadData = await uploadRes.json();
        setUploading(false);

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed');
        }
        
        finalImageUrl = uploadData.imageUrl; // If upload is successful, update the URL for the next step
      }

      // --- Step 2: Update the menu item with the final data ---
      // This will use either the original imageUrl or the newly uploaded one.
      const finalDataToUpdate = { ...formData, imageUrl: finalImageUrl };

      const updateRes = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: JSON.stringify(finalDataToUpdate),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update the menu item');
      }
      
      const updatedItem = await updateRes.json();
      onUpdate(updatedItem); // Pass the updated item back to the dashboard page
      onClose(); // Close the modal

    } catch (err) {
      setError(err.message);
      setUploading(false); // Make sure loading state is turned off on error
    }
  };

  return (
    // Modal background overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal panel */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Menu Item</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <p className="font-medium text-sm mb-1">Current Image:</p>
            <img src={formData.imageUrl} alt="Current item" className="w-32 h-32 object-cover rounded-md border" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} className="p-2 border rounded w-full" step="0.01" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Change Image (Optional)</label>
                <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="p-2 border rounded w-full" rows="3" />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;