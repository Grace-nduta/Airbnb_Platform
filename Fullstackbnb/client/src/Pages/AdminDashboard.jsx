import React, { useState, useEffect } from 'react';
import {
  Users, Home, BarChart3, Shield, Eye, CheckCircle, XCircle, TrendingUp, MapPin,
  Calendar, DollarSign, UserCheck, UserX, Trash2, Search, Download, Bell, Settings
} from 'lucide-react';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeListings: 0,
    totalUsers: 0,
    popularLocations: []
  });

  // Get the actual token from localStorage instead of hardcoded value
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const usersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!usersRes.ok) {
        throw new Error(`Users fetch failed: ${usersRes.status}`);
      }
      
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);

      // Fetch listings
      const listingsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/listings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!listingsRes.ok) {
        throw new Error(`Listings fetch failed: ${listingsRes.status}`);
      }
      
      const listingsData = await listingsRes.json();
      setListings(listingsData);
      
      const analyticsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!analyticsRes.ok) {
        throw new Error(`Analytics fetch failed: ${analyticsRes.status}`);
      }
      
      const analytics = await analyticsRes.json();
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        toast.error('Session expired. Please log in again.');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role changed to ${newRole}`);
    } catch (error) {
      toast.error('Failed to change user role');
    }
  };

  const toggleUserStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const updateListingStatus = async (listingId, status) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      
      setListings(listings.map(l => l.id === listingId ? { ...l, status } : l));
      toast.success(`Listing ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update listing status');
    }
  };

  const deleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setListings(listings.filter(l => l.id !== listingId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: 'bg-green-500 text-white',
      Suspended: 'bg-red-500 text-white',
      pending: 'bg-yellow-500 text-white',
      active: 'bg-green-500 text-white',
      inactive: 'bg-red-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getRoleColor = (role) => {
    const colors = {
      Admin: 'bg-red-500 text-white',
      Host: 'bg-blue-500 text-white',
      Guest: 'bg-gray-500 text-white'
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'users', name: 'Manage Users', icon: Users },
    { id: 'listings', name: 'Verify Listings', icon: Home },
  ];

  if (users.length === 0 && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">

      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">

        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>


        <div className="flex-1 p-6">
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Bookings', value: analyticsData.totalBookings || 0, icon: Calendar, color: 'bg-blue-500' },
                  { title: 'Total Revenue', value: `$${analyticsData.totalRevenue || 0}`, icon: DollarSign, color: 'bg-green-500' },
                  { title: 'Active Listings', value: analyticsData.activeListings || 0, icon: Home, color: 'bg-purple-500' },
                  { title: 'Total Users', value: analyticsData.totalUsers || 0, icon: Users, color: 'bg-red-500' },
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>


              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
                    Popular Locations
                  </h3>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Download className="w-4 h-4 inline mr-2" />
                    Export
                  </button>
                </div>
                <div className="space-y-4">
                  {(analyticsData.popularLocations || []).map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {location.location}
                          </p>
                          <p className="text-gray-400 text-sm">{location.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">${location.revenue?.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>


              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Host">Host</option>
                    <option value="Guest">Guest</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.avatar || '/api/placeholder/48/48'} 
                          alt={user.username || 'User'} 
                          className="w-12 h-12 rounded-lg object-cover" 
                        />
                        <div>
                          <h3 className="text-white font-semibold">{user.username || 'Unknown User'}</h3>
                          <p className="text-gray-400">{user.email}</p>
                          <p className="text-gray-500 text-sm">Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(user.status || 'Active')}`}>
                          {user.status || 'Active'}
                        </span>
                        

                        <div className="flex space-x-2">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="guest">Guest</option>
                            <option value="host">Host</option>
                            <option value="admin">Admin</option>
                          </select>
                          
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              (user.status || 'Active') === 'Active' 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title={(user.status || 'Active') === 'Active' ? 'Suspend User' : 'Activate User'}
                          >
                            {(user.status || 'Active') === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'listings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Listing Verification</h2>

              <div className="space-y-4">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={listing.image_url || '/api/placeholder/96/96'} 
                        alt={listing.title} 
                        className="w-24 h-24 rounded-lg object-cover" 
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{listing.title}</h3>
                            <div className="space-y-1 text-gray-400">
                              <p className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {listing.location}
                              </p>
                              <p className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Hosted by {listing.host || `User ${listing.user_id}`}
                              </p>
                              <p className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Submitted {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white mb-2">${listing.price_per_night}/night</p>
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(listing.status)}`}>
                              {listing.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-3">
                            {listing.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateListingStatus(listing.id, 'active')}
                                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateListingStatus(listing.id, 'inactive')}
                                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;