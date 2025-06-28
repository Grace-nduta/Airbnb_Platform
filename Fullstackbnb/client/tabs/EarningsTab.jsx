import React from 'react';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';


function EarningsTab({ listings, totalRevenue, totalBookings, animate }) {
    const avgPerBooking = totalBookings > 0 ? Math.floor(totalRevenue / totalBookings) : 0;

    return (
        <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
                Earnings Dashboard 💰
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
                    <DollarSign className="w-6 h-6 mb-2" />
                    <h3 className="font-semibold text-lg">Total Earnings</h3>
                    <p className="text-2xl font-bold">${(totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div className="bg-cyan-500 text-white p-6 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <h3 className="font-semibold text-lg">This Month</h3>
                    <p className="text-2xl font-bold">${Math.floor((totalRevenue || 0) * 0.3).toLocaleString()}</p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <h3 className="font-semibold text-lg">Avg per Booking</h3>
                    <p className="text-2xl font-bold">${avgPerBooking}</p>
                </div>
            </div>

            <div className="bg-white/80 p-6 rounded-xl border border-pink-100 shadow">
                <h3 className="text-xl font-semibold mb-4">Earnings by Property</h3>
                <div className="space-y-3">
                    {listings.map((listing) => (
                        <div key={listing.id} className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                            <span>{listing.title}</span>
                            <span className="text-green-600 font-bold">
                                ${((listing.revenue || 0).toLocaleString())}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EarningsTab;