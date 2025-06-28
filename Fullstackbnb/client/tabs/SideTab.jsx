import React from 'react';
import { Users, Eye, TrendingUp } from 'lucide-react';

function Sidetab({ selectedTab, setSelectedTab }) {
    const tabs = [
        { id: 'users', label: 'Manage Users', icon: Users },
        { id: 'listings', label: 'Verify Listings', icon: Eye },
        { id: 'analytics', label: 'View Analytics', icon: TrendingUp },
    ];

    return (
        <aside className="w-64 bg-white border-r p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-pink-600">🛠 Admin Dashboard</h2>
            <nav className="space-y-4">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`flex items-center w-full text-left px-3 py-2 rounded hover:bg-pink-100 transition-colors ${
                            selectedTab === id ? 'bg-pink-200 font-semibold' : ''
                        }`}
                        onClick={() => setSelectedTab(id)}
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default Sidetab;
