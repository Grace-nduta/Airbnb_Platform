import React, { useState } from 'react';
import { LogOut, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Also remove user role

    // Dispatch custom event to notify navbar and other components
    window.dispatchEvent(new Event('authChange'));

    setTimeout(() => {
      alert('You have been logged out successfully! 👋');
      setIsLoggingOut(false);
      navigate('/login');
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <LogOut className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">See you soon!</h1>
          <p className="text-gray-600">Thanks for spending time with us today</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging out...
              </span>
            ) : (
              'Logout'
            )}
          </button>

          <button
            onClick={handleCancel}
            className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center text-gray-400">
          <span className="text-sm">Made with</span>
          <Heart className="w-4 h-4 mx-1 text-pink-400 fill-current" />
          <span className="text-sm">for you</span>
        </div>
      </div>
    </div>
  );
}