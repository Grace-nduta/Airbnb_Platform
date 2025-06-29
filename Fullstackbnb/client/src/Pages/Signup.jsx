import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'guest',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('❌ Passwords do not match! Please try again.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('🎉 Signup successful! Redirecting...', {
          onClose: () => navigate('/'),
          autoClose: 1500,
        });
      } else {
        toast.error(data.error || '❌ Signup failed. Please try again.');
      }
    } catch (err) {
      toast.error('⚠️ Network error. Please try again later.');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating icons */}
        <div className="absolute top-10 left-10 text-pink-300 animate-pulse">
          <Heart className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-20 text-purple-300 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-20 text-rose-300 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute bottom-10 right-10 text-pink-400 animate-bounce">
          <Heart className="w-6 h-6" />
        </div>

        {/* Signup Box */}
        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome!
            </h1>
            <p className="text-gray-600 font-medium">Create your account and explore the world</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8 relative">
            <div className="absolute top-4 right-4 text-pink-200">
              <Heart className="w-4 h-4" />
            </div>
            <div className="absolute bottom-4 left-4 text-purple-200">
              <Sparkles className="w-4 h-4" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" />
                  Your Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your name"
                    required
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-gray-400"
                    placeholder="your@email.com"
                    required
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 placeholder-gray-400"
                      placeholder="Create a secure password"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-500" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 bg-gradient-to-r from-pink-50 to-rose-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 placeholder-gray-400 ${
                          form.confirmPassword && form.password !== form.confirmPassword
                              ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                              : form.confirmPassword && form.password === form.confirmPassword
                                  ? 'border-green-300 focus:border-green-400 focus:ring-green-100'
                                  : 'border-pink-200 focus:border-pink-400 focus:ring-pink-100'
                      }`}
                      placeholder="Confirm your password"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      ❌ Passwords don't match
                    </p>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                      ✅ Passwords match!
                    </p>
                )}
              </div>

              {/* Role selection */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registering as...
                </label>
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 cursor-pointer"
                >
                  <option value="guest">🌍 Traveler (Guest)</option>
                  <option value="host">🏠 Host</option>
                  <option value="both">🌐 Traveler & Host</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>

              {/* Optional role-based notice */}
              {form.role === 'admin' && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                    Admin accounts are special. Ensure you're authorized.
                  </p>
              )}

              {/* Submit */}
              <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Create My Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-pink-100">
              <p className="text-gray-600 mb-3">Already have an account?</p>
              <button
                  onClick={handleLoginClick}
                  className="text-pink-600 hover:text-purple-600 font-semibold hover:underline transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                Sign in here
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Join thousands of travelers and hosts around the world
              <Heart className="w-4 h-4 text-pink-400" />
            </p>
          </div>
        </div>

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
      </div>
  );
}

export default Signup;
