import React, { useState } from 'react';
import { Calendar } from "lucide-react";

function BookingsTab({ bookings, onCancelBooking, onBrowseListings }) {
  const [cancellingBookings, setCancellingBookings] = useState(new Set());

  const handleCancelClick = async (bookingId) => {
    if (cancellingBookings.has(bookingId)) return;

    setCancellingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      // Call the parent's cancel function which handles API and state updates
      await onCancelBooking(bookingId);
    } finally {
      setCancellingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const canCancelBooking = (booking) => {
    const status = booking.booking_status || booking.status || 'pending';
    // Only allow cancellation for pending bookings
    return status.toLowerCase() === 'pending';
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    switch (normalizedStatus) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <div className="text-2xl">📆</div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/50">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">Start exploring and book your first stay!</p>
            <button
              onClick={onBrowseListings}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isCancelling = cancellingBookings.has(booking.id);
              const canCancel = canCancelBooking(booking);
              const status = booking.booking_status || booking.status || 'pending';

              return (
                <div key={booking.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{booking.listing?.image || "🏠"}</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{booking.listing?.title || `Booking ${booking.id}`}</h3>
                        <p className="text-gray-600">{booking.listing?.location || 'Location pending'}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{booking.check_in} to {booking.check_out}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">${booking.total_price}</div>
                      {canCancel ? (
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={isCancelling}
                          className={`mt-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
                            isCancelling 
                              ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed" 
                              : "text-red-600 border-red-200 hover:bg-red-50"
                          }`}
                        >
                          {isCancelling ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <div className="mt-2 px-4 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg text-center">
                          {status.toLowerCase() === 'confirmed' ? 'Cannot cancel confirmed booking' : 
                           status.toLowerCase() === 'completed' ? 'Booking completed' :
                           status.toLowerCase() === 'cancelled' ? 'Already cancelled' :
                           'Cancellation not available'}
                        </div>
                      )}
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

export default BookingsTab;
