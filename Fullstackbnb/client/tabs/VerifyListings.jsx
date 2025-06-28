import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

function VerifyListings({ listings, updateListingStatus, getStatusColor }) {
    const pendingListings = listings.filter(listing => listing.status === 'Pending');

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Verify Listings</h3>
                <p className="text-gray-600">Review and approve/reject property listings</p>
            </div>

            <div className="grid gap-6">
                {pendingListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">{listing.title}</h4>
                                <p className="text-gray-600">Host: {listing.host}</p>
                                <p className="text-gray-600">Location: {listing.location}</p>
                                <p className="text-lg font-bold text-pink-600">${listing.price_per_night || 0}/night</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                {listing.status}
              </span>
                        </div>

                        <div className="text-sm text-gray-500 mb-4">
                            Submitted: {listing.submitDate}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => updateListingStatus(listing.id, 'Approved')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                            </button>
                            <button
                                onClick={() => updateListingStatus(listing.id, 'Rejected')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                            </button>
                        </div>
                    </div>
                ))}

                {pendingListings.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                        <p className="text-gray-600">No pending listings to review</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyListings;
