import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function Login() {
     const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5555/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        localStorage.setItem('token', data.access_token);

        // ✅ Fetch current user to get role
        const userRes = await fetch('http://127.0.0.1:5555/current_user', {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        console.log('User response status:', userRes.status);
        console.log('User response headers:', userRes.headers);
        
        const userData = await userRes.json();
        console.log('User data response:', userData);

        if (userRes.ok) {
          const role = userData.role;
          console.log('User role:', role);

          // ✅ Store user role in localStorage for navbar conditional rendering
          localStorage.setItem('userRole', role);

          // Dispatch custom event to notify navbar and other components of auth change
          window.dispatchEvent(new Event('authChange'));

          // ✅ Navigate based on role
          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'host') {
            navigate('/host');
          } else {
            navigate('/user');
          }
        } else {
          console.error('Failed to get user info:', userData);
          alert(`Login successful, but failed to get user info: ${userData.error || 'Unknown error'}`);
        }

      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  const handleSignupClick = () => {
   navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back! ✨
          </h1>
          <p className="text-gray-600 font-medium">Sign in to your account</p>
        </div>

    
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8 relative">
          
          <div className="absolute top-4 right-4 text-pink-200">
            <Heart className="w-4 h-4" />
          </div>
          <div className="absolute bottom-4 left-4 text-purple-200">
            <Sparkles className="w-4 h-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="your.email@example.com"
                required
              />
            </div>

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
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-pink-100">
            <p className="text-gray-600 mb-3">Don't have an account?</p>
            <button
              onClick={handleSignupClick}
              className="text-pink-600 hover:text-purple-600 font-semibold hover:underline transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Create one here
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Join thousands of amazing travelers and hosts worldwide
            <Heart className="w-4 h-4 text-pink-400" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;