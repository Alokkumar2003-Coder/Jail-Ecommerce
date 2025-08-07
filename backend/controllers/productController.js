import db from '../models/index.js';
import cloudinary from '../utils/cloudinary.js';
import { Op } from 'sequelize';

// Get all products (with optional category filter and search)
export const getProducts = async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    const where = {};
    
    // Category filter
    if (categoryId && categoryId !== '') {
      where.categoryId = categoryId;
    }
    
    // Search filter - search in both title and description
    if (search && search.trim() !== '') {
      where[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    console.log('Query params:', { categoryId, search }); // Debug log
    console.log('Where clause:', where); // Debug log

    const products = await db.Product.findAll({
      where,
      include: [{ model: db.Category, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']], // Sort by newest first
    });
    
    console.log(`Found ${products.length} products`); // Debug log
    res.json(products);
  } catch (err) {
    console.error('Error in getProducts:', err); // Debug log
    res.status(500).json({ message: err.message });
  }
};

// Get single product (with reviews)
export const getProduct = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      include: [
        { model: db.Category, attributes: ['id', 'name'] },
        {
          model: db.Review,
          include: [{ model: db.User, attributes: ['id', 'name'] }],
        },
      ],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, images, stock, categoryId } = req.body;
    const product = await db.Product.create({
      title,
      description,
      price,
      discount,
      images,
      stock,
      categoryId,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, discount, images, stock, categoryId } = req.body;
    const product = await db.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discount = discount ?? product.discount;
    product.images = images ?? product.images;
    product.stock = stock ?? product.stock;
    product.categoryId = categoryId ?? product.categoryId;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Image upload
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/products' },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};