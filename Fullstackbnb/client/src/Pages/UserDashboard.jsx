import React, { useState, useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import BookingsTab from "./BookingsTab"; 
import FavoritesTab from "./FavoritesTab";
import ReviewsTab from "./ReviewsTab";
import { 
  Search, 
  Calendar, 
  Heart, 
  Star, 
  User, 
  ChevronRight 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState('browse');
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]); 
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search filters state
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: '',
    maxPrice: '',
    amenities: []
  });

  // Alternative approach: Use a function to get token to avoid stale closures
  const getToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch all listings on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const [listingsRes, bookingsRes, favoritesRes, reviewsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/listings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (listingsRes.ok) {
        let listingsData = await listingsRes.json();
        if (Array.isArray(listingsData)) {
          setAllListings(listingsData);
          setListings(listingsData);
        }
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      } else {
        console.error('Failed to fetch bookings:', bookingsRes.status);
        setBookings([]);
      }

      if (favoritesRes.ok) {
        const favoritesData = await favoritesRes.json();
        console.log('Favorites data received:', favoritesData); // Debug log
        // Extract just the listing IDs for the favorites array, with null checking
        const favoriteListingIds = Array.isArray(favoritesData) 
          ? favoritesData.filter(fav => fav && fav.listing_id).map(fav => fav.listing_id)
          : [];
        setFavorites(favoriteListingIds);
      } else {
        console.error('Failed to fetch favorites');
        setFavorites([]); // Set empty array on error
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const reviewsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const handleBookNow = async (listingId) => {
    const checkIn = searchFilters.checkIn || new Date().toISOString().split('T')[0];
   
    let checkOut = searchFilters.checkOut;
    
    if (!checkOut || checkOut <= checkIn) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      checkOut = nextDay.toISOString().split('T')[0];
    }

    const currentToken = getToken();
    
    if (!currentToken) {
      toast.error('Please log in to book a listing.');
      return;
    }

    try {
      const listing = listings.find(l => l.id === listingId);
      
      if (!listing) {
        toast.error('Listing not found.');
        return;
      }

      // Calculate number of nights
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
      const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
      
      // Ensure at least 1 night
      const nights = Math.max(1, numberOfNights);
      const pricePerNight = listing.price_per_night || listing.price || 0;
      const totalPrice = pricePerNight * nights;

      console.log(`Booking calculation: ${pricePerNight}/night x ${nights} nights = $${totalPrice}`);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          return;
        }
        toast.error(data.error || 'Booking failed.');
        return;
      }

      const data = await response.json();
      setBookings(prev => [...prev, data]); 
      toast.success(`Booking successful! Total: $${totalPrice} for ${nights} ${nights === 1 ? 'night' : 'nights'}`);
      setSelectedTab('bookings');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Network error. Try again.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const currentToken = getToken();
    
    if (!currentToken) {
      toast.error('Please log in to cancel booking.');
      return;
    }

    // Check if booking can be cancelled (frontend validation)
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const status = (booking.booking_status || booking.status || 'pending').toLowerCase();
      if (status !== 'pending') {
        if (status === 'confirmed') {
          toast.error('Cannot cancel confirmed booking');
        } else if (status === 'completed') {
          toast.error('Cannot cancel completed booking');
        } else if (status === 'cancelled') {
          toast.error('Booking is already cancelled');
        } else {
          toast.error(`Cannot cancel booking with status: ${status}`);
        }
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle specific error cases
        if (response.status === 400) {
          // Status-based errors from backend
          toast.error(data.error);
        } else if (response.status === 403) {
          toast.error('You do not have permission to cancel this booking');
        } else if (response.status === 404) {
          toast.error('Booking not found');
        } else {
          toast.error(data.error || 'Failed to cancel booking.');
        }
        return;
      }

      // Immediately remove the booking from the UI
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      toast.success('Booking cancelled successfully.');
      
      // Optionally refresh bookings data from server to ensure sync
      setTimeout(() => {
        refreshBookings();
      }, 1000);
      
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error('Network error. Try again.');
    }
  };

  const refreshBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const bookingsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    }
  };

  const toggleFavorite = async (listingId) => {
    const currentToken = getToken();
    
    if (!currentToken) {
      toast.error('Please log in to add favorites.');
      return;
    }

    try {
      if (favorites.includes(listingId)) {
        // Remove from favorites - need to find the favorite ID first
        const favoritesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          const favoriteToRemove = favoritesData.find(fav => fav.listing_id === listingId);
          
          if (favoriteToRemove) {
            const deleteResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${favoriteToRemove.favorite_id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            
            if (deleteResponse.ok) {
              setFavorites(prev => prev.filter(id => id !== listingId));
              toast.info('Removed from favorites.');
            }
          }
        }
      } else {
        // Add to favorites
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            listing_id: listingId,
            note: 'Added from browse listings'
          }),
        });

        if (response.ok) {
          setFavorites(prev => [...prev, listingId]);
          toast.success('Added to favorites!');
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to add to favorites.');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites.');
    }
  };
  
  // Handle search with backend API
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter listings based on search criteria
    let filtered = allListings;
    
    if (searchFilters.location) {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }
    
    if (searchFilters.minPrice) {
      filtered = filtered.filter(listing => 
        (listing.price_per_night || listing.price) >= parseFloat(searchFilters.minPrice)
      );
    }
    
    if (searchFilters.maxPrice) {
      filtered = filtered.filter(listing => 
        (listing.price_per_night || listing.price) <= parseFloat(searchFilters.maxPrice)
      );
    }
    
    setListings(filtered);
    toast.info('Search results updated!');
  };

  // Clear search filters
  const clearFilters = () => {
    setSearchFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: '',
      maxPrice: '',
      amenities: []
    });
    setListings(allListings); // Reset to all listings
    toast.info('Filters cleared.');
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const navItems = [
    { id: 'browse', label: 'Browse Listings', icon: Search },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'profile', label: 'Profile Settings', icon: User }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <aside className="w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r border-blue-100">
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              👤
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Guest Dashboard</h2>
              <p className="text-sm text-gray-500">Find your perfect stay</p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedTab(item.id);
                  toast.info(`${item.label} tab opened`);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  selectedTab === item.id
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {selectedTab === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <ToastContainer position="top-right" autoClose={3000} />

        {selectedTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Browse Listings</h1>
              <div className="text-2xl">🏡</div>
            </div>
            <form onSubmit={handleSearch} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={searchFilters.location} // This is now guaranteed to be a string
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={searchFilters.checkIn} // This is now guaranteed to be a string
                    onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={searchFilters.checkOut} // This is now guaranteed to be a string
                    onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select
                    value={searchFilters.guests} // This is now guaranteed to be a number
                    onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                    <Search size={16} className="inline mr-1" />
                    Search
                  </button>
                  <button 
                    type="button" 
                    onClick={clearFilters}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {/* Additional price filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price per Night</label>
                  <input
                    type="number"
                    placeholder="$0"
                    min="0"
                    value={searchFilters.minPrice} // This is now guaranteed to be a string
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price per Night</label>
                  <input
                    type="number"
                    placeholder="$1000"
                    min="0"
                    value={searchFilters.maxPrice} // This is now guaranteed to be a string
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </form>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {listings.length > 0 ? (
                listings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
                    <div className="relative">
                      <img 
                        src={listing.image_url || listing.image || '/api/placeholder/300/200'} 
                        alt={listing.title} 
                        className="w-full h-40 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/300/200';
                        }}
                      />
                      <button
                        onClick={() => toggleFavorite(listing.id)}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${
                          favorites.includes(listing.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <Heart size={16} fill={favorites.includes(listing.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{listing.title}</h3>
                    <p className="text-gray-600 mb-2">{listing.location}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-600 font-semibold text-lg">${listing.price_per_night || listing.price} / night</span>
                      {listing.rating && (
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{listing.rating}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleBookNow(listing.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-gray-600 text-lg">No listings found matching your criteria.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'bookings' && (
          <BookingsTab bookings={bookings} onCancelBooking={handleCancelBooking} onBrowseListings={() => setSelectedTab('browse')} />
        )}
        {selectedTab === 'favorites' && (
          <FavoritesTab
            listings={listings}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {selectedTab === 'reviews' && <ReviewsTab reviews={reviews} onRefreshReviews={refreshReviews} />}
        {selectedTab === 'profile' && <ProfileSettings />}
      </main>
    </div>
  );
}

export default UserDashboard;