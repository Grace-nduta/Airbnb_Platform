import React from 'react';

function AddListingTab({
  newListing,
  setNewListing,
  handleAddListing,
  setSelectedTab,
  animate,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewListing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`transition-all duration-500 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
        {newListing.id ? 'Edit Listing' : 'Add New Listing'} 🏠
      </h1>

      <form onSubmit={handleAddListing} className="space-y-6 max-w-lg">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={newListing.title || ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Listing title"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={newListing.location || ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="City, state, or address"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newListing.description || ''}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Describe your listing"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="image_url">
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            value={newListing.image_url || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Price per night */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="price_per_night">
            Price per Night (USD)
          </label>
          <input
            type="number"
            id="price_per_night"
            name="price_per_night"
            value={newListing.price_per_night || ''}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="100"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="amenities">
            Amenities
          </label>
          <textarea
            id="amenities"
            name="amenities"
            value={newListing.amenities || ''}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Wi-Fi, Air Conditioning, Kitchen, Free Parking, etc."
          />
          <p className="text-sm text-gray-500 mt-1">
            List amenities separated by commas
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
        >
            {newListing.id ? 'Update Listing' : 'Add Listing'}
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedTab('listings')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
          >
            Cancel
        </button>
        </div>
      </form>
    </div>
  );
}

export default AddListingTab;
