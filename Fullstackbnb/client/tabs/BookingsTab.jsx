import React from 'react';
import { Calendar, DollarSign, Check, X, Home } from 'lucide-react';

function BookingsTab({
  bookings = [],
  onApproveBooking,
  onRejectBooking,
  onBrowseListings,
  animate,
  getStatusColor
}) {
  return (
    <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
        Booking Requests 📅
      </h1>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.booking_id || booking.id}
              className="p-6 rounded-xl shadow bg-white/80 border border-pink-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Listing ID: {booking.listing_id}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {booking.check_in} – {booking.check_out}
                    </p>
                    <p>
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      ${booking.total_price}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Guest ID: {booking.guest_id}
                    </p>
                  </div>
                </div>

                <div className="mt-3 md:mt-0 space-x-3 flex items-center">
                  {booking.booking_status === 'pending' ? (
                    <>
                      <button
                        onClick={() => onApproveBooking(booking.booking_id || booking.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => onRejectBooking(booking.booking_id || booking.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : null}
                  
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    getStatusColor ? getStatusColor(booking.booking_status) : 'bg-blue-100 text-blue-700'
                  }`}>
                    {booking.booking_status === 'confirmed' ? 'Approved' :
                     booking.booking_status === 'cancelled' ? 'Rejected' :
                     booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 bg-white/80 border border-pink-100 rounded-xl shadow">
            <div className="text-5xl mb-2">📋</div>
            <h2 className="text-xl font-semibold mb-2">No booking requests</h2>
            <p className="text-gray-600 mb-4">You'll see booking requests from guests here.</p>
            <button
              onClick={onBrowseListings}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              Manage Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingsTab;
