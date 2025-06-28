import React from 'react';
import { UserCheck } from 'lucide-react';

function SignupHeader() {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4 shadow-lg">
                <UserCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Our Community</h2>
            <p className="text-gray-600">
                Create your account and start exploring amazing places
            </p>
        </div>
    );
}

export default SignupHeader;