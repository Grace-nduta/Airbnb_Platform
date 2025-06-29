import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../Components/BookingForm';
import ReviewForm from '../Components/ReviewForm';
import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Coffee, Tv } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetails();
    fetchListingReviews();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/listings/${id}`);
      
      if (!response.ok) {
        throw new Error('Listing not found');
      }
      
      const listingData = await response.json();
      setListing(listingData);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError(error.message);
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const fetchListingReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/listing/${id}`);
      
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderAmenityIcon = (amenity) => {
    const iconMap = {
      'wifi': <Wifi size={16} className="mr-2" />,
      'parking': <Car size={16} className="mr-2" />,
      'kitchen': <Coffee size={16} className="mr-2" />,
      'tv': <Tv size={16} className="mr-2" />
    };
    
    return iconMap[amenity.toLowerCase()] || <span className="mr-2">•</span>;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Listing Not Found</h1>
        <p className="text-gray-600 mb-4">{error || 'The listing you are looking for does not exist.'}</p>
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const amenitiesList = listing.amenities ? 
    (typeof listing.amenities === 'string' ? listing.amenities.split(',') : listing.amenities) : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span>{listing.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {reviews.length > 0 && (
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                <span className="font-medium">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-pink-600">
            ${listing.price_per_night}/night
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {listing.image_url ? (
          <div className="md:col-span-2">
            <img 
              src={listing.image_url} 
              alt={listing.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/api/placeholder/600/400';
              }}
            />
          </div>
        ) : (
          <div className="md:col-span-2 bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
            <span className="text-6xl">🏠</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
            <span className="text-2xl">📸</span>
          </div>
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
            <span className="text-2xl">📸</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">About this place</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Amenities */}
          {amenitiesList.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {amenitiesList.map((amenity, i) => (
                  <div key={i} className="flex items-center py-2">
                    {renderAmenityIcon(amenity.trim())}
                    <span className="text-gray-700">{amenity.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {review.user_name ? review.user_name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{review.user_name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 border rounded-xl shadow-lg p-6 bg-white">
            <BookingForm 
              listingId={id} 
              pricePerNight={listing.price_per_night}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
