import React, { useState, useEffect } from 'react';

// Tabs
import OverviewTab from '../../tabs/OverviewTab.jsx';
import ListingsTab from '../../tabs/ListingsTab.jsx';
import AddListingTab from '../../tabs/AddListingTab.jsx';
import BookingsTab from '../../tabs/BookingsTab.jsx';
import EarningsTab from '../../tabs/EarningsTab.jsx';
import InsightsTab from '../../tabs/InsightsTab.jsx';
import Sidebar from '../../tabs/Sidebar.jsx';


function HostDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [animateCards, setAnimateCards] = useState(false);

  const [listings, setListings] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price_per_night: '',
    location: '',
    amenities: '',
    image_url: '',
  });

  // Get token for authenticated requests
  const getToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch host's data on mount or tab change
  useEffect(() => {
    setAnimateCards(true);
    const token = getToken();

    if (!token) {
      console.error('No token found. User may not be logged in.');
      return;
    }

    // Fetch host's listings
    fetch(`${import.meta.env.VITE_API_BASE_URL}/host/listings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setListings(data);
          } else {
            console.error('Invalid listings data:', data);
          setListings([]);
          }
        })
        .catch(err => {
        console.error('Error fetching host listings:', err);
        setListings([]);
      });

    // Fetch host's bookings
    fetch(`${import.meta.env.VITE_API_BASE_URL}/host/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookingRequests(data);
        } else {
          console.error('Invalid bookings data:', data);
          setBookingRequests([]);
        }
      })
      .catch(err => {
        console.error('Error fetching host bookings:', err);
        setBookingRequests([]);
      });

    // Fetch total earnings
    fetch(`${import.meta.env.VITE_API_BASE_URL}/host/total-earnings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setTotalEarnings(data.total_earnings || 0);
      })
      .catch(err => {
        console.error('Error fetching total earnings:', err);
        setTotalEarnings(0);
      });
  }, [selectedTab]);

  // Calculate stats from real data
  const totalRevenue = totalEarnings;
  const totalBookings = bookingRequests.length;
  const averageRating = listings.length > 0 
    ? listings.reduce((sum, l) => sum + (l.average_rating || 0), 0) / listings.length 
      : 0;

  // Handlers for booking requests
  const handleApproveRequest = async (bookingId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/bookings/${bookingId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
    setBookingRequests((prev) =>
      prev.map((req) =>
            req.booking_id === bookingId ? { ...req, booking_status: 'confirmed' } : req
      )
    );
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleRejectRequest = async (bookingId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/bookings/${bookingId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
    setBookingRequests((prev) =>
      prev.map((req) =>
            req.booking_id === bookingId ? { ...req, booking_status: 'rejected' } : req
      )
    );
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  // Add or update listing handler
  const handleAddListing = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      let response;

    if (newListing.id) {
      // Editing existing listing
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/${newListing.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newListing)
        });
    } else {
      // Adding new listing
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/listings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newListing)
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Listing operation successful:', result.message);
        
        // Reset form
        setNewListing({
          title: '',
          description: '',
          price_per_night: '',
          location: '',
          amenities: '',
          image_url: '',
        });
        
        // Refresh listings
        const listingsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/listings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          setListings(Array.isArray(listingsData) ? listingsData : []);
        }
        
        // Switch to listings tab to see the result
        setSelectedTab('listings');
      } else {
        const errorData = await response.json();
        console.error('Listing operation failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error in listing operation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handlers for managing listings
  const handleEditListing = (listing) => {
    setNewListing(listing);
      setSelectedTab('add-listing');
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setListings(listings.filter(l => l.id !== listingId));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleToggleListingStatus = async (listingId) => {
    const token = getToken();
    if (!token) return;

    const listing = listings.find(l => l.id === listingId);
    const newStatus = listing.status === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/host/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
    setListings(listings.map(l =>
          l.id === listingId ? { ...l, status: newStatus } : l
    ));
      }
    } catch (error) {
      console.error('Error updating listing status:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <main className="flex-1 p-8">
        {selectedTab === 'overview' && (
          <OverviewTab
            listings={listings}
            totalRevenue={totalRevenue}
            totalBookings={totalBookings}
            averageRating={averageRating}
            setSelectedTab={setSelectedTab}
            animate={animateCards}
          />
        )}

        {selectedTab === 'listings' && (
          <ListingsTab
            listings={listings}
            animate={animateCards}
            getStatusColor={getStatusColor}
            onEdit={handleEditListing}
            onDelete={handleDeleteListing}
            onToggleStatus={handleToggleListingStatus}
          />
        )}

        {selectedTab === 'add-listing' && (
          <AddListingTab
            newListing={newListing}
            setNewListing={setNewListing}
            handleAddListing={handleAddListing}
            setSelectedTab={setSelectedTab}
            animate={animateCards}
          />
        )}

        {selectedTab === 'bookings' && (
          <BookingsTab
            bookings={bookingRequests}
            onApproveBooking={handleApproveRequest}
            onRejectBooking={handleRejectRequest}
            onBrowseListings={() => setSelectedTab('listings')}
            animate={animateCards}
            getStatusColor={getStatusColor}
          />
        )}

        {selectedTab === 'earnings' && (
          <EarningsTab
            listings={listings}
            totalRevenue={totalRevenue}
            totalBookings={totalBookings}
            animate={animateCards}
          />
        )}

        {selectedTab === 'insights' && (
          <InsightsTab listings={listings} animate={animateCards} />
        )}
      </main>
    </div>
  );
}

export default HostDashboard;
