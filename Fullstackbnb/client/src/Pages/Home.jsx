import React, { useState, useEffect } from 'react';
import Filters from '../../Components/Filters';
import ListingCard from '../../Components/ListingCard';


function Home() {
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    amenity: '',
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching listings from home page...');
    fetch('http://127.0.0.1:5555/listings')
      .then((res) => {
        console.log('Listings response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('Listings data received:', data);
        setListings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching listings:', error);
        setLoading(false);
      });
  }, []);

  const filtered = listings.filter((l) => {
    return (
      l.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      (!filters.price || (l.price_per_night || l.price) <= Number(filters.price))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Find Your Next Stay</h1>
      <Filters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <p className="text-gray-600">Loading listings...</p>
        ) : filtered.length > 0 ? (
          filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <p className="text-gray-600">No listings found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;