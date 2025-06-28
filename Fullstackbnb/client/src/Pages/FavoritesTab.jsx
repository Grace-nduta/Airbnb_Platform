import { Heart } from "lucide-react";
import React from "react";

function FavoritesTab({ listings = [], favorites = [], toggleFavorite }) {
  
  const safeListings = Array.isArray(listings) ? listings : [];
  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  

  const favoriteListings = safeListings.filter(listing => {
    try {
      return listing && listing.id && safeFavorites.includes(listing.id);
    } catch (error) {
      console.error('Error filtering favorite listing:', error, listing);
      return false;
    }
  });

  console.log('FavoritesTab Debug:', { 
    safeListings: safeListings.length, 
    safeFavorites, 
    favoriteListings: favoriteListings.length 
  });

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          <div className="text-2xl">❤️</div>
        </div>

        {favoriteListings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/50">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No favorites yet</h3>
            <p className="text-gray-600">Save properties you love for easy access later!</p>
            {safeFavorites.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                You have {safeFavorites.length} favorite(s) but they might not be visible due to filtering.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteListings.map((listing) => {
              if (!listing || !listing.id) return null; 
              
              return (
              <div key={listing.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={listing.image_url || listing.image || '/api/placeholder/300/200'} 
                      alt={listing.title || 'Listing'} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                      }}
                    />
                </div>
                <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{listing.title || 'Untitled Listing'}</h3>
                    <p className="text-gray-600 mb-4">{listing.location || 'Location not specified'}</p>
                  <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-800">
                        ${listing.price_per_night || listing.price || 0}/night
                      </div>
                    <button
                        onClick={() => toggleFavorite && toggleFavorite(listing.id)}
                      className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200"
                        title="Remove from favorites"
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesTab;