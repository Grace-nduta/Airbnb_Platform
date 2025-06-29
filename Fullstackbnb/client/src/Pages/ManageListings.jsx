import React, { useEffect, useState } from 'react';
import { Heart, MapPin, Star, Search, Filter, Calendar, Users, Trash2, Pencil, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListingsDisplay() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [favorites, setFavorites] = useState(new Set());
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Fetch listings from backend
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/listings`);
      const data = await res.json();
      setListings(data);
      toast.success('Listings loaded successfully');
    } catch (err) {
      console.error('Error fetching listings:', err);
      toast.error('Failed to fetch listings');
    }
  };

  // 🗑 Delete a listing
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.success || 'Listing deleted successfully');
        setListings(prev => prev.filter(listing => listing.id !== id));
      } else {
        toast.error(data.error || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Server error during deletion');
    }
  };

  // 📝 Edit a listing
  const handleEdit = (listing) => {
    setEditingListing(listing);
    setEditForm({
      title: listing.title,
      description: listing.description,
      price_per_night: listing.price_per_night,
      location: listing.location,
      image_url: listing.image_url,
      amenities: listing.amenities?.join(', ') || ''
    });
    toast.info(`Editing listing: ${listing.title}`);
  };

  // 💾 Save edited listing
  const handleSaveEdit = async () => {
    if (!editingListing) return;

    setIsLoading(true);
    try {
      const amenitiesArray = editForm.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const updateData = {
        title: editForm.title,
        description: editForm.description,
        price_per_night: parseFloat(editForm.price_per_night),
        location: editForm.location,
        image_url: editForm.image_url,
        amenities: amenitiesArray
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/${editingListing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.success || 'Listing updated successfully');
        setListings(prev => prev.map(listing => 
          listing.id === editingListing.id 
            ? { ...listing, ...updateData }
            : listing
        ));
        setEditingListing(null);
        setEditForm({});
      } else {
        toast.error(data.error || 'Failed to update listing');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Server error during update');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(listingId) ? newFavorites.delete(listingId) : newFavorites.add(listingId);
    setFavorites(newFavorites);
    toast.success(newFavorites.has(listingId) 
      ? 'Added to favorites' 
      : 'Removed from favorites');
  };

  const filteredListings = listings
    .filter(listing =>
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(listing =>
      listing.price_per_night >= priceRange[0] &&
      listing.price_per_night <= priceRange[1]
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Amazing Places</h1>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-300 rounded-lg">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Price Range</span>
                <select
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setPriceRange([min, max]);
                  }}
                  className="border-none focus:ring-0 text-sm"
                >
                  <option value="0-500">$0 - $500</option>
                  <option value="0-150">$0 - $150</option>
                  <option value="150-300">$150 - $300</option>
                  <option value="300-500">$300+</option>
                </select>
              </div>

              <button 
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => toast.info('Date selection feature coming soon!')}
              >
                <Calendar className="h-5 w-5" />
                Check Dates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{filteredListings.length} properties found</p>
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            onChange={(e) => toast.info(`Sorting by: ${e.target.value}`)}
          >
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating: Highest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group">
              <div className="relative">
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
                >
                  <Heart
                    className={`h-5 w-5 ${favorites.has(listing.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`}
                  />
                </button>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{listing.title}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{listing.rating || '4.8'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{listing.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.amenities?.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-gray-900">${listing.price_per_night}</span>
                    <span className="text-gray-600 text-sm"> / night</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                    type="button"
                      onClick={() => handleDelete(listing.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or price range</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Listing</h2>
              <button
                onClick={() => setEditingListing(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
                <input
                  type="number"
                  value={editForm.price_per_night || ''}
                  onChange={(e) => setEditForm({...editForm, price_per_night: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editForm.image_url || ''}
                  onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.amenities || ''}
                  onChange={(e) => setEditForm({...editForm, amenities: e.target.value})}
                  placeholder="WiFi, Pool, Parking"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg font-medium"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
              type="button" 
                onClick={() => {
                  setEditingListing(null);
                  toast.info('Edit cancelled');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingsDisplay;