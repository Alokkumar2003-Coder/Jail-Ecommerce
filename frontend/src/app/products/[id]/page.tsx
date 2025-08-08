'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '../../../redux/hooks';
import { addToCart } from '../../../redux/cartSlice';
import { addToWishlist } from '../../../redux/wishlistSlice';
import api from '../../../utils/axios';
import ReviewForm from '../../../components/ReviewForm';

interface Review {
  id: number;
  rating: number;
  comment: string;
  user?: { 
    id: number;
    name: string; 
    avatar?: string | null;
  };
  createdAt: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  stock: number;
  rating: number;
  category: { name: string };
  reviews: Review[];
  // Specifications
  brand?: string;
  model?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  warranty?: string;
  specifications?: Record<string, string>;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const dispatch = useAppDispatch();

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id);
      const response = await api.get(`/products/${id}`);
      console.log('Product data received:', response.data);
      console.log('Reviews in product:', response.data.reviews);
      console.log('Review count:', response.data.reviews?.length || 0);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews separately for product:', id);
      const response = await api.get(`/reviews/product/${id}`);
      console.log('Reviews fetched separately:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '/placeholder.png',
        quantity: 1,
      })
    );
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    dispatch(addToWishlist(product.id));
  };

  const handleReviewSubmitted = async () => {
    console.log('Review submitted, refreshing product data...');
    // Refresh product data to show new review
    await fetchProduct();
    
    // Also fetch reviews separately to ensure we have the latest data
    const reviews = await fetchReviews();
    if (product) {
      setProduct({
        ...product,
        reviews: reviews
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-500' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const getSpecifications = () => {
    const specs = [];
    
    if (product?.brand) specs.push({ label: 'Brand', value: product.brand });
    if (product?.model) specs.push({ label: 'Model', value: product.model });
    if (product?.weight) specs.push({ label: 'Weight', value: product.weight });
    if (product?.dimensions) specs.push({ label: 'Dimensions', value: product.dimensions });
    if (product?.color) specs.push({ label: 'Color', value: product.color });
    if (product?.material) specs.push({ label: 'Material', value: product.material });
    if (product?.warranty) specs.push({ label: 'Warranty', value: product.warranty });
    
    // Add custom specifications
    if (product?.specifications) {
      Object.entries(product.specifications).forEach(([key, value]) => {
        specs.push({ label: key, value: value as string });
      });
    }
    
    return specs;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found.</div>
      </div>
    );
  }

  const specifications = getSpecifications();
  const reviewCount = product.reviews?.length || 0;

  console.log('Rendering product with review count:', reviewCount);
  console.log('Reviews array:', product.reviews);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.category?.name}</p>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm text-red-500">
                -{product.discount}% OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {renderStars(Math.round(product.rating || 0))}
              <span className="ml-2 text-gray-600">
                {product.rating?.toFixed(1) || '0.0'} ({reviewCount} reviews)
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'description'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'specifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews ({reviewCount})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === 'description' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Specifications</h2>
            {specifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <dt className="text-sm font-medium text-gray-500">{spec.label}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            
            <div className="mb-8">
              <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
            </div>
            
            {reviewCount === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {product.reviews?.map((review) => {
                  // Add null checks for review.user
                  const userName = review.user?.name || 'Anonymous User';
                  const userAvatar = review.user?.avatar;
                  const userInitial = userName.charAt(0).toUpperCase();
                  
                  return (
                    <div key={review.id} className="bg-white border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            {userAvatar ? (
                              <img
                                src={userAvatar}
                                alt={userName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 font-semibold">
                                {userInitial}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{userName}</h4>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}