import React from 'react';
import { TrendingUp, Eye, Users } from 'lucide-react';

function AnalyticsOverview({ analyticsData }) {
    const topLocationBookings = analyticsData.popularLocations[0]?.bookings || 1;

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Analytics Overview</h3>
                <p className="text-gray-600">Key metrics and performance indicators</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card icon={<TrendingUp className="w-6 h-6 text-blue-600" />} label="Total Bookings" value={analyticsData.totalBookings.toLocaleString()} />
                <Card icon={<TrendingUp className="w-6 h-6 text-green-600" />} label="Total Revenue" value={`$${analyticsData.totalRevenue.toLocaleString()}`} />
                <Card icon={<Eye className="w-6 h-6 text-purple-600" />} label="Active Listings" value={analyticsData.activeListings} />
                <Card icon={<Users className="w-6 h-6 text-pink-600" />} label="Total Users" value={analyticsData.totalUsers.toLocaleString()} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Popular Locations</h4>
                <div className="space-y-4">
                    {analyticsData.popularLocations.map((loc, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700">{loc.location}</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-pink-600 h-2 rounded-full"
                                        style={{ width: `${(loc.bookings / topLocationBookings) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600">{loc.bookings}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Card({ icon, label, value }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

export default AnalyticsOverview;
