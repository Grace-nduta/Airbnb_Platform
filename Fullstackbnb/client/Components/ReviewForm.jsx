import React, { useState, useEffect } from 'react';
import { Star } from "lucide-react";
import { toast } from 'react-toastify';

function ReviewForm({ onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    listing_id: '',
    rating: 5,
    comment: ''
  });
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get token for authenticated requests
  const getToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch user's completed bookings to show available listings to review
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch('api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Filter only confirmed/completed bookings
        const completedBookings = data.filter(booking => 
          booking.booking_status === 'confirmed' || booking.booking_status === 'completed'
        );
        
        // Create a map to avoid duplicate listings
        const uniqueListings = new Map();
        completedBookings.forEach(booking => {
          if (!uniqueListings.has(booking.listing_id)) {
            uniqueListings.set(booking.listing_id, {
              listing_id: booking.listing_id,
              listing_title: booking.listing_title || `Listing ${booking.listing_id}`,
              check_in: booking.check_in,
              check_out: booking.check_out
            });
          }
        });
        
        setUserBookings(Array.from(uniqueListings.values()));
      })
      .catch(err => console.error('Error fetching bookings:', err));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      toast.error('Please log in to leave a review.');
      return;
    }

    if (!formData.listing_id) {
      toast.error('Please select a listing to review.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5555/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setFormData({
          listing_id: '',
          rating: 5,
          comment: ''
        });
        
        // Call the callback to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Listing Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Listing to Review
        </label>
        <select
          name="listing_id"
          value={formData.listing_id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a listing you've stayed at...</option>
          {userBookings.map(booking => (
            <option key={booking.listing_id} value={booking.listing_id}>
              {booking.listing_title}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              className="text-2xl focus:outline-none"
            >
              <Star
                size={24}
                className={star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
        </div>
        </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review Comment
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          required
          placeholder="Share your experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;

