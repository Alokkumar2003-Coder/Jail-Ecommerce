import db from '../models/index.js';

// Add review
export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    console.log('Adding review:', { productId, rating, comment, userId: req.user.id });
    
    // Check if user already reviewed this product
    let existingReview = await db.Review.findOne({
      where: { productId, userId: req.user.id },
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create new review
    const review = await db.Review.create({
      productId,
      userId: req.user.id,
      rating,
      comment,
    });

    console.log('Review created:', review.id);

    // Update product rating
    await updateProductRating(productId);

    // Return the review with user data using MySQL-compatible raw query
    const reviewWithUser = await db.sequelize.query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.createdAt,
        u.id as user_id,
        u.name as user_name,
        u.avatar as user_avatar
      FROM Reviews r
      LEFT JOIN Users u ON r.userId = u.id
      WHERE r.id = :reviewId
    `, {
      replacements: { reviewId: review.id },
      type: db.sequelize.QueryTypes.SELECT
    });

    const transformedReview = reviewWithUser[0] ? {
      id: reviewWithUser[0].id,
      rating: reviewWithUser[0].rating,
      comment: reviewWithUser[0].comment,
      createdAt: reviewWithUser[0].createdAt,
      user: {
        id: reviewWithUser[0].user_id,
        name: reviewWithUser[0].user_name,
        avatar: reviewWithUser[0].user_avatar
      }
    } : null;

    console.log('Review with user data:', transformedReview);

    res.status(201).json(transformedReview);
  } catch (err) {
    console.error('Error adding review:', err);
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
    await updateProductRating(review.productId);

    // Return the review with user data
    const reviewWithUser = await db.Review.findByPk(review.id, {
      include: [{ model: db.User, attributes: ['id', 'name', 'avatar'] }],
    });

    res.json(reviewWithUser);
  } catch (err) {
    console.error('Error editing review:', err);
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
    await updateProductRating(productId);

    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: err.message });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await db.Review.findAll({ where: { productId } });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    const product = await db.Product.findByPk(productId);
    if (product) {
      product.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
      await product.save();
      console.log(`Updated product ${productId} rating to ${product.rating}`);
    }
  } catch (err) {
    console.error('Error updating product rating:', err);
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Fetching reviews for product:', productId);
    
    const reviews = await db.sequelize.query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.createdAt,
        u.id as user_id,
        u.name as user_name,
        u.avatar as user_avatar
      FROM Reviews r
      LEFT JOIN Users u ON r.userId = u.id
      WHERE r.productId = :productId
      ORDER BY r.createdAt DESC
    `, {
      replacements: { productId },
      type: db.sequelize.QueryTypes.SELECT
    });

    // Transform the raw query results
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        id: review.user_id,
        name: review.user_name,
        avatar: review.user_avatar
      }
    }));
    
    console.log('Found reviews:', transformedReviews.length);
    console.log('Sample review:', transformedReviews[0]);
    res.json(transformedReviews);
  } catch (err) {
    console.error('Error getting product reviews:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews (for debugging)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await db.sequelize.query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.createdAt,
        r.productId,
        u.id as user_id,
        u.name as user_name,
        u.avatar as user_avatar,
        p.title as product_title
      FROM Reviews r
      LEFT JOIN Users u ON r.userId = u.id
      LEFT JOIN Products p ON r.productId = p.id
      ORDER BY r.createdAt DESC
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });
    
    console.log('All reviews:', reviews.length);
    console.log('Sample review with user:', reviews[0]);
    res.json(reviews);
  } catch (err) {
    console.error('Error getting all reviews:', err);
    res.status(500).json({ message: err.message });
  }
};