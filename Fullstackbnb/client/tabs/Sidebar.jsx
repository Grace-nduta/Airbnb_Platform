// Sidebar.jsx
import React from 'react';

import {
    Home, Plus, Calendar, DollarSign, BarChart3, TrendingUp
} from 'lucide-react';

const tabs = [
    { id: 'overview', label: 'Overview', emoji: '📊', icon: BarChart3 },
    { id: 'listings', label: 'Manage Listings', emoji: '🏠', icon: Home },
    { id: 'add-listing', label: 'Add New Listing', emoji: '➕', icon: Plus },
    { id: 'bookings', label: 'View Bookings', emoji: '📅', icon: Calendar },
    { id: 'earnings', label: 'Earnings Dashboard', emoji: '💰', icon: DollarSign },
    { id: 'insights', label: 'Booking Insights', emoji: '📈', icon: TrendingUp }
];

const Sidebar = ({ selectedTab, setSelectedTab }) => (
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-pink-200 p-6 shadow-lg">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">🏠</div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Host Dashboard</h2>
        </div>
        <nav className="space-y-3">
            {tabs.map(({ id, label, icon: Icon, emoji }) => (
                <button
                    key={id}
                    onClick={() => setSelectedTab(id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        selectedTab === id ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' : 'hover:bg-pink-100/50'
                    }`}
                >
                    <span className="text-lg mr-3">{emoji}</span>
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="font-medium">{label}</span>
                </button>
            ))}
        </nav>
    </aside>
);

export default Sidebar;