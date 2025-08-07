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
  user: { name: string };
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
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
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

  const handleReviewSubmitted = () => {
    // Refresh product data to show new review
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          
          <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
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
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        <div className="mb-8">
          <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
        </div>
        
        {product.reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.user.name}</span>
                  <span className="text-yellow-500">★ {review.rating}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}