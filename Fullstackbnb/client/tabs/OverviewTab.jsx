import React from 'react';
import { DollarSign, Calendar, Star, Home, Plus } from 'lucide-react';

function OverviewTab({ listings, totalRevenue, totalBookings, averageRating, setSelectedTab, animate }) {
  return (
    <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
        Welcome back, Host! 👋
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <DollarSign className="h-8 w-8 text-pink-500" />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-semibold">${totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Calendar className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-xl font-semibold">{totalBookings || 0}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Star className="h-8 w-8 text-yellow-400" />
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-xl font-semibold">{averageRating?.toFixed(2) || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Home className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Total Listings</p>
            <p className="text-xl font-semibold">{listings?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedTab('add-listing')}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          <Plus className="h-5 w-5" /> Add New Listing
        </button>

        <button
          onClick={() => setSelectedTab('bookings')}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          <Calendar className="h-5 w-5" /> View Bookings
        </button>
      </div>
    </div>
  );
}

export default OverviewTab;
