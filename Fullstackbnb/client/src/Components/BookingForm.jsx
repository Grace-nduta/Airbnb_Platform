import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function BookingForm({ listingId, pricePerNight = 100 }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate number of nights and total price
  const calculateTotal = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return Math.max(1, nights) * pricePerNight;
    }
    return pricePerNight;
  };

  const getToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
      toast.error('Please log in to make a booking.');
      navigate('/login');
      return;
    }

    if (!listingId) {
      toast.error('Listing information is missing. Please try again.');
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates.');
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    if (endDate <= startDate) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    setIsLoading(true);

    const bookingData = {
      listing_id: parseInt(listingId),
      check_in: checkIn,
      check_out: checkOut,
      total_price: calculateTotal()
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Booking response:', result);
      toast.success('Booking request submitted successfully!');
      
      // Navigate to user dashboard bookings tab
      navigate('/user');
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(error.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-pink-600">Book This Stay</h3>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Check-In</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Check-Out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split('T')[0]}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
          ))}
        </select>
      </div>

      {checkIn && checkOut && (
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex justify-between text-sm">
            <span>${pricePerNight} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span>${pricePerNight * nights}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Submitting...' : 'Request to Book'}
      </button>
    </form>
  );
}

export default BookingForm;
