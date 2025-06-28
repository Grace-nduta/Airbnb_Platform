import React from 'react';
import { Star } from 'lucide-react';

function InsightsTab({ listings, animate }) {
    const topProperty =
        listings.length > 0
            ? listings.reduce((prev, current) =>
                prev.bookings > current.bookings ? prev : current
            )
            : null;

    const topRated =
        listings.length > 0
            ? listings.reduce((prev, current) =>
                prev.rating > current.rating ? prev : current
            )
            : null;

    return (
        <div
            className={`transition-all duration-500 ${
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
                Booking Insights 📈
            </h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-yellow-100 p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">Top Performing</h3>
                    {topProperty ? (
                        <>
                            <div>
                                {topProperty.title} – {topProperty.bookings} bookings
                            </div>
                            <div className="text-green-600 font-bold">
                                ${ (topProperty.revenue || 0).toLocaleString() }
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500">No listings yet</div>
                    )}
                </div>

                <div className="bg-purple-100 p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">Highest Rated</h3>
                    {topRated ? (
                        <>
                            <div>{topRated.title}</div>
                            <div className="flex items-center text-yellow-600 font-bold">
                                <Star className="w-4 h-4 mr-1" /> {topRated.rating} (
                                {topRated.reviews} reviews)
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500">No reviews yet</div>
                    )}
                </div>
            </div>

            <div className="bg-white/80 p-6 rounded-xl border border-pink-100 shadow">
                <h3 className="text-xl font-semibold mb-4">Booking Performance</h3>
                {listings.length > 0 ? (
                    <div className="space-y-3">
                        {listings.map((l) => {
                            const maxBookings = Math.max(
                                ...listings.map((li) => li.bookings || 0)
                            );
                            const percent = maxBookings
                                ? (l.bookings / maxBookings) * 100
                                : 0;

                            return (
                                <div key={l.id}>
                                    <div className="flex justify-between">
                                        <span>{l.title}</span>
                                        <span>{l.bookings} bookings</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className="bg-pink-500 h-2 rounded-full"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No bookings available</p>
                )}
            </div>
        </div>
    );
}

export default InsightsTab;
