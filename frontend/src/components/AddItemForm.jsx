import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddItemForm = ({ onNewItem }) => {
  // State for the text inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // State to manage the file and the upload process
  const [imageFile, setImageFile] = useState(null); // This will hold the selected file object
  const [uploading, setUploading] = useState(false); // This is true while the image is being uploaded

  // State for displaying any errors to the user
  const [error, setError] = useState('');
  const { adminInfo } = useAuth(); // Get admin info for the auth token

  // This function runs whenever the user selects a file from the file input
  const handleFileChange = (e) => {
    // e.target.files is a list of files selected; we only care about the first one.
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // This function runs when the admin submits the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setError(''); // Clear any previous errors

    // First, check if an image has been selected
    if (!imageFile) {
      setError('Please select an image file to upload.');
      return;
    }

    try {
      // --- Step 1: Upload the image file to our backend ---
      setUploading(true);
      const imageFormData = new FormData(); // FormData is required for sending files
      imageFormData.append('image', imageFile); // The key 'image' must match the backend (upload.single('image'))

      const uploadResponse = await fetch('http://localhost:5002/api/upload', {
        method: 'POST',
        headers: {
          // Note: We don't set 'Content-Type'. The browser sets it automatically for FormData.
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: imageFormData,
      });
      
      const uploadData = await uploadResponse.json();
      setUploading(false); // Stop the loading indicator

      if (!uploadResponse.ok) {
        // If the upload failed, show the error from the backend
        throw new Error(uploadData.message || 'Image upload failed');
      }

      // --- Step 2: Create the menu item using the URL from the upload response ---
      const newItemData = {
        name,
        description,
        price,
        imageUrl: uploadData.imageUrl, // Use the secure URL returned from our backend
      };

      const createItemResponse = await fetch('http://localhost:5002/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`,
        },
        body: JSON.stringify(newItemData),
      });

      const createItemData = await createItemResponse.json();
      if (!createItemResponse.ok) {
        throw new Error(createItemData.message || 'Failed to create menu item');
      }
      
      // Pass the newly created item back to the dashboard page to update the list
      onNewItem(createItemData);
      
      // --- Step 3: Clear the form for the next entry ---
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      // Manually clear the file input field so the same file can be chosen again if needed
      if(document.getElementById('image-upload')) {
        document.getElementById('image-upload').value = null;
      }

    } catch (err) {
      // If any step fails, show the error message and stop the loading indicator
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
            <input 
                id="image-upload" // An ID helps us to reset the input field
                type="file" 
                onChange={handleFileChange} 
                className="p-2 border rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                required 
            />
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