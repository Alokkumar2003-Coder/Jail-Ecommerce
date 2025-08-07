import db from '../models/index.js';

// Add review
export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    let review = await db.Review.findOne({
      where: { productId, userId: req.user.id },
    });
    if (review) return res.status(400).json({ message: 'Already reviewed' });

    review = await db.Review.create({
      productId,
      userId: req.user.id,
      rating,
      comment,
    });

    // Update product rating
    const reviews = await db.Review.findAll({ where: { productId } });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const product = await db.Product.findByPk(productId);
    product.rating = avgRating;
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit review
export const editReview = async (req, res) => {
  try {
    const review = await db.Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    // Update product rating
    const reviews = await db.Review.findAll({ where: { productId: review.productId } });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const product = await db.Product.findByPk(review.productId);
    product.rating = avgRating;
    await product.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await db.Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    const productId = review.productId;
    await review.destroy();

    // Update product rating
    const reviews = await db.Review.findAll({ where: { productId } });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    const product = await db.Product.findByPk(productId);
    product.rating = avgRating;
    await product.save();

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};