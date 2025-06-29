import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ProfileSettings() {
  const [user, setUser] = useState({
    id: null,
    username: '',
    email: '',
    password: ''
  });

  const [hasFetched, setHasFetched] = useState(false); 

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/current_user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(data => {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          password: ''
        });
        setHasFetched(true); 
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        if (!hasFetched) toast.error("Could not load user profile");
        setHasFetched(true);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user.username || !user.email) {
      toast.error("Username and email are required");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        ...(user.password && { password: user.password })
      })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          toast.error(data.error || "Update failed");
        } else {
          toast.success(data.success || "Profile updated");
          setUser(prev => ({ ...prev, password: '' }));
        }
      })
      .catch(() => toast.error("Network error"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
        <div className="text-2xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={!user.username || !user.email}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
