import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import RoleSelector from './RoleSelector';

function SignupForm({
                        form,
                        handleChange,
                        handleSubmit,
                        handleLoginClick,
                        showPassword,
                        setShowPassword,
                    }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters long
                    </p>
                </div>
                <RoleSelector form={form} handleChange={handleChange} />
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                    Create My Account
                </button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-pink-500 hover:text-pink-600 underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-pink-500 hover:text-pink-600 underline">
                        Privacy Policy
                    </a>
                </p>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                        onClick={handleLoginClick}
                        type="button"
                        className="text-pink-500 hover:text-pink-600 font-medium underline transition-colors"
                    >
                        Sign in here
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignupForm;

