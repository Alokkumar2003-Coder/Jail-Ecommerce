import db from '../models/index.js';
import cloudinary from '../utils/cloudinary.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await db.Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await db.Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await db.Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.name = name ?? category.name;
    category.description = description ?? category.description;
    category.image = image ?? category.image;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await db.Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Image upload for categories
export const uploadCategoryImage = async (req, res) => {
  try {
    console.log('Category image upload request received');
    console.log('Request file:', req.file);
    console.log('Request headers:', req.headers);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/categories' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: error.message });
        }
        console.log('Upload successful:', result.secure_url);
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error('Category image upload error:', err);
    res.status(500).json({ message: err.message });
  }
};