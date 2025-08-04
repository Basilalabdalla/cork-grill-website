import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingState, setEditingState] = useState({ id: null, name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { adminInfo } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) { setError("Failed to load categories."); } 
      finally { setLoading(false); }
    };
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCategories([...categories, data]);
      setNewCategoryName('');
    } catch (err) { setError(err.message); }
  };

  const handleUpdate = async (id) => {
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
        body: JSON.stringify({ name: editingState.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCategories(categories.map(c => c._id === id ? data : c));
      setEditingState({ id: null, name: '' });
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminInfo.token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) { setError(err.message); }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" className="p-2 border rounded flex-grow" />
        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Add</button>
      </form>
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            {editingState.id === cat._id ? (
              <input type="text" value={editingState.name} onChange={(e) => setEditingState({ ...editingState, name: e.target.value })} className="p-2 border rounded flex-grow" />
            ) : (
              <span className="flex-grow px-2">{cat.name}</span>
            )}
            <div className="flex gap-2 flex-shrink-0">
              {editingState.id === cat._id ? (
                <>
                  <button onClick={() => handleUpdate(cat._id)} className="text-green-600 font-semibold">Save</button>
                  <button onClick={() => setEditingState({ id: null, name: '' })} className="text-gray-500">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditingState({ id: cat._id, name: cat.name })} className="text-indigo-600">Edit</button>
              )}
              <button onClick={() => handleDelete(cat._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoryManager;