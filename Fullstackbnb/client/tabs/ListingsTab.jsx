import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Star,
  Edit3,
  Eye,
  Trash2,
  RefreshCcw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';


const renderAmenityIcon = (amenity) => {
  const icons = { wifi: 'Wifi', parking: 'Car', kitchen: 'Coffee', tv: 'Tv' };
  return <span className="mr-1">{amenity}</span>;
};

function ListingsTab({
  listings,
  animate,
  getStatusColor,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const [expandedListings, setExpandedListings] = useState(new Set());
  const [listingReviews, setListingReviews] = useState({});

  const toggleListingExpanded = (listingId) => {
    const newExpanded = new Set(expandedListings);
    if (newExpanded.has(listingId)) {
      newExpanded.delete(listingId);
    } else {
      newExpanded.add(listingId);
      // Fetch reviews for this listing if not already fetched
      if (!listingReviews[listingId]) {
        fetchListingReviews(listingId);
      }
    }
    setExpandedListings(newExpanded);
  };

  const fetchListingReviews = async (listingId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/listing/${listingId}`);
      if (response.ok) {
        const reviews = await response.json();
        setListingReviews(prev => ({
          ...prev,
          [listingId]: reviews
        }));
      }
    } catch (error) {
      console.error('Error fetching reviews for listing:', listingId, error);
    }
  };

  return (
    <div
      className={`transition-all duration-500 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
        Manage Your Listings 🏠
      </h1>
      <div className="grid gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white/80 p-6 rounded-2xl shadow-md border border-pink-100"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{listing.title}</h3>
                <p className="text-gray-600 flex items-center mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location}
                </p>
                <div className="flex space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {listing.bedrooms} bed
                  </span>
                  <span className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {listing.bathrooms} bath
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {listing.maxGuests} guests
                  </span>
                </div>
                <div className="flex space-x-2 mb-4">
                  {(Array.isArray(listing.amenities) ? listing.amenities : []).map(
                    (a, index) => (
                      <span
                        key={`${listing.id}-amenity-${index}-${a}`}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center"
                      >
                        {renderAmenityIcon(a)} <span className="ml-1">{a}</span>
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {listing.rating ?? 0} ({listing.reviews ?? 0} reviews)
                  </div>
                  <div className="text-lg font-bold text-pink-600">
                    ${listing.price_per_night ?? 0}/night
                  </div>
                </div>
                <div className="mt-4 flex space-x-3 flex-wrap">
                  <button
                    onClick={() => onEdit(listing.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={() => onToggleStatus(listing.id)}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      listing.status === 'active'
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => toggleListingExpanded(listing.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Reviews
                    {expandedListings.has(listing.id) ? 
                      <ChevronUp className="w-4 h-4 ml-1" /> : 
                      <ChevronDown className="w-4 h-4 ml-1" />
                    }
                  </button>
                </div>
              </div>
              <div className="lg:w-48">
                <div className="text-center text-4xl mb-2">
                  {listing.images && listing.images.length > 0
                    ? listing.images[0]
                    : '🏠'}
                </div>
                <div className="text-sm text-gray-600 mb-4">Featured</div>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Bookings:</strong> {listing.bookings ?? 0}
                  </p>
                  <p>
                    <strong>Revenue:</strong>{' '}
                    <span className="text-green-600">
                      ${Number(listing.revenue ?? 0).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div
                  className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(
                    listing.status
                  )}`}
                >
                  {listing.status}
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            {expandedListings.has(listing.id) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Guest Reviews
                </h4>
                
                {listingReviews[listing.id] ? (
                  listingReviews[listing.id].length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {listingReviews[listing.id].map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-800">{review.user_name}</span>
                              <div className="flex items-center ml-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No reviews yet for this listing.
                    </div>
                  )
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    Loading reviews...
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingsTab;