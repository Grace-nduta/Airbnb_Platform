import React from 'react';
import { User, Home } from 'lucide-react';

function RoleSelector({ form, handleChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                How do you want to join us?
            </label>
            <div className="grid grid-cols-2 gap-3">
                <label
                    className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        form.role === 'guest'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                >
                    <input
                        type="radio"
                        name="role"
                        value="guest"
                        checked={form.role === 'guest'}
                        onChange={handleChange}
                        className="sr-only"
                    />
                    <User className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Guest</span>
                    <span className="text-xs text-center">Book amazing places</span>
                </label>

                <label
                    className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        form.role === 'host'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                >
                    <input
                        type="radio"
                        name="role"
                        value="host"
                        checked={form.role === 'host'}
                        onChange={handleChange}
                        className="sr-only"
                    />
                    <Home className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Host</span>
                    <span className="text-xs text-center">Share your space</span>
                </label>
            </div>
        </div>
    );
}

export default RoleSelector;
