const Category = require('../models/categoryModel');

const getCategories = async (req, res) => { try { const categories = await Category.find({}).sort({ name: 1 }); res.json(categories); } catch (error) { res.status(500).json({ message: 'Server Error' }); } };
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });
  try {
    if (await Category.findOne({ name })) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) { res.status(400).json({ message: error.message }); }
};
const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = name || category.name;
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else { res.status(404).json({ message: 'Category not found' }); }
  } catch (error) { res.status(400).json({ message: error.message }); }
};
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) { res.json({ message: 'Category removed' }); } 
    else { res.status(404).json({ message: 'Category not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };