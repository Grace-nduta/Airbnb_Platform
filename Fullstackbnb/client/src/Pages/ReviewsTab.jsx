import React, { useState } from 'react';
import { Star, RefreshCw } from "lucide-react";
import ReviewForm from '../../Components/ReviewForm';

function ReviewsTab({ reviews = [], onRefreshReviews }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefreshReviews) {
      setIsRefreshing(true);
      await onRefreshReviews();
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">My Reviews</h1>
        <div className="flex items-center space-x-4">
          <span className="text-2xl">⭐</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg text-gray-800">{review.listing_title || 'Listing'}</h2>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">{review.comment}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold">Rating: {review.rating}/5</span>
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/50">
          <Star size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No reviews yet</h3>
          <p className="text-gray-600">Complete a stay and leave your first review below!</p>
        </div>
      )}

      <div className="mt-8 p-6 bg-white/80 rounded-xl shadow border border-white/50">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Leave a Review</h2>
        <ReviewForm onReviewSubmitted={onRefreshReviews} />
      </div>
    </div>
  );
}

export default ReviewsTab;
