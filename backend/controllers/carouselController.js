import db from '../models/index.js';
import cloudinary from '../utils/cloudinary.js';

// Get all carousel items (public)
export const getCarouselItems = async (req, res) => {
  try {
    const carouselItems = await db.Carousel.findAll({
      where: { active: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json(carouselItems);
  } catch (err) {
    console.error('Error getting carousel items:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all carousel items (admin - including inactive)
export const getAllCarouselItems = async (req, res) => {
  try {
    const carouselItems = await db.Carousel.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json(carouselItems);
  } catch (err) {
    console.error('Error getting all carousel items:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get single carousel item
export const getCarouselItem = async (req, res) => {
  try {
    const carouselItem = await db.Carousel.findByPk(req.params.id);
    if (!carouselItem) {
      return res.status(404).json({ message: 'Carousel item not found' });
    }
    res.json(carouselItem);
  } catch (err) {
    console.error('Error getting carousel item:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create carousel item (admin only)
export const createCarouselItem = async (req, res) => {
  try {
    const { title, link, description, active, order } = req.body;
    
    const carouselItem = await db.Carousel.create({
      title,
      image: req.body.image, // This will be set from uploaded image
      link,
      description,
      active: active !== undefined ? active : true,
      order: order || 0,
    });
    
    res.status(201).json(carouselItem);
  } catch (err) {
    console.error('Error creating carousel item:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update carousel item (admin only)
export const updateCarouselItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, description, active, order } = req.body;
    
    const carouselItem = await db.Carousel.findByPk(id);
    if (!carouselItem) {
      return res.status(404).json({ message: 'Carousel item not found' });
    }
    
    carouselItem.title = title ?? carouselItem.title;
    carouselItem.link = link ?? carouselItem.link;
    carouselItem.description = description ?? carouselItem.description;
    carouselItem.active = active !== undefined ? active : carouselItem.active;
    carouselItem.order = order !== undefined ? order : carouselItem.order;
    
    if (req.body.image) {
      carouselItem.image = req.body.image;
    }
    
    await carouselItem.save();
    res.json(carouselItem);
  } catch (err) {
    console.error('Error updating carousel item:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete carousel item (admin only)
export const deleteCarouselItem = async (req, res) => {
  try {
    const { id } = req.params;
    const carouselItem = await db.Carousel.findByPk(id);
    if (!carouselItem) {
      return res.status(404).json({ message: 'Carousel item not found' });
    }
    
    await carouselItem.destroy();
    res.json({ message: 'Carousel item deleted successfully' });
  } catch (err) {
    console.error('Error deleting carousel item:', err);
    res.status(500).json({ message: err.message });
  }
};

// Upload carousel image
export const uploadCarouselImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/carousel' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error('Error uploading carousel image:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update carousel order (admin only)
export const updateCarouselOrder = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }
    
    for (const item of items) {
      await db.Carousel.update(
        { order: item.order },
        { where: { id: item.id } }
      );
    }
    
    res.json({ message: 'Carousel order updated successfully' });
  } catch (err) {
    console.error('Error updating carousel order:', err);
    res.status(500).json({ message: err.message });
  }
};