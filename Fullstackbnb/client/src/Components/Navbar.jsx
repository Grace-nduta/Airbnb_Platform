import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Check authentication status on component mount and when localStorage changes
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            
            setIsLoggedIn(!!token);
            setUserRole(role);
        };

        // Initial check
        checkAuthStatus();

        // Listen for storage changes (when user logs in/out in another tab)
        window.addEventListener('storage', checkAuthStatus);

        // Listen for custom auth change events (for same-tab updates)
        window.addEventListener('authChange', checkAuthStatus);

        // Cleanup listeners
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
            window.removeEventListener('authChange', checkAuthStatus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'));
        
        navigate('/');
    };

    return (
        <nav className="bg-pink-100 shadow-md px-6 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-extrabold text-pink-600">
                Airbnb Platform
            </Link>
            <div className="space-x-4">
                <Link to="/" className="text-pink-700 hover:text-pink-500 font-medium">Home</Link>
                
                {/* Show these links only when logged in */}
                {isLoggedIn && (
                    <>
                        {userRole === 'guest' && (
                            <Link to="/user" className="text-pink-700 hover:text-pink-500 font-medium">Dashboard</Link>
                        )}
                        {userRole === 'host' && (
                            <Link to="/host" className="text-pink-700 hover:text-pink-500 font-medium">Host Panel</Link>
                        )}
                        {userRole === 'admin' && (
                            <Link to="/admin" className="text-pink-700 hover:text-pink-500 font-medium">Admin</Link>
                        )}
                    </>
                )}
                
                {/* Show Sign Up and Login only when NOT logged in */}
                {!isLoggedIn && (
                    <>
                        <Link to="/Signup" className="text-pink-700 hover:text-pink-500 font-medium">Sign Up</Link>
                        <Link to="/login" className="text-pink-700 hover:text-pink-500 font-medium">Login</Link>
                    </>
                )}
                
                {/* Show Logout only when logged in */}
                {isLoggedIn && (
                    <button 
                        onClick={handleLogout}
                        className="text-pink-700 hover:text-pink-500 font-medium cursor-pointer"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
export default Navbar;
