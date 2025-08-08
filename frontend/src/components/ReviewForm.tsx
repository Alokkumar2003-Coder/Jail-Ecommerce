'use client';

import { useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import api from '../utils/axios';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting review:', { productId, rating, comment });
      const response = await api.post('/reviews', {
        productId,
        rating,
        comment: comment.trim(),
      });
      
      console.log('Review submitted successfully:', response.data);
      
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Please login to submit a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                } hover:text-yellow-500 transition-colors`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating} out of 5</span>
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts about this product..."
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}