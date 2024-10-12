import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown state

    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsProfileOpen(false); // Close profile dropdown when logging out
        // Implement actual logout logic here
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        }
    }, [user]);

    const shouldShowHomeButton = location.pathname !== '/home';

    const handleHomeClick = () => {
        if (user) {
            navigate('/home');
        }
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <nav className="bg-gray-800 fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-white text-lg font-semibold">
                        Expense Tracker
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {shouldShowHomeButton && (
                            <button
                                onClick={handleHomeClick}
                                className="text-white px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                            >
                                Home
                            </button>
                        )}
                        {isLoggedIn ? (
                            <>
                                {!shouldShowHomeButton && (
                                    <button
                                        onClick={() => navigate('/add-expense')}
                                        className="text-white px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Add Expense
                                    </button>
                                )}

                                {/* Profile button with avatar */}
                                <div className="relative">
                                    <button onClick={toggleProfileDropdown} className="focus:outline-none">
                                        <img
                                            src="https://via.placeholder.com/40" // Replace with actual avatar
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </button>

                                    {/* Profile dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-white px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-white px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-300"
                                >
                                    Signup
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu (visible only when open) */}
                {isMenuOpen && (
                    <div className="md:hidden flex flex-col space-y-2 mt-4">
                        {shouldShowHomeButton && (
                            <button
                                onClick={handleHomeClick}
                                className="text-white w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                            >
                                Home
                            </button>
                        )}
                        {isLoggedIn ? (
                            <>
                                {!shouldShowHomeButton && (
                                    <button
                                        onClick={() => navigate('/add-expense')}
                                        className="text-white w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Add Expense
                                    </button>
                                )}

                                {/* Profile dropdown in mobile */}
                                <div className="relative">
                                    <button onClick={toggleProfileDropdown} className="focus:outline-none w-full text-left">
                                        <img
                                            src="https://via.placeholder.com/40" // Replace with actual avatar
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full mx-auto"
                                        />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="mt-2 w-full bg-white rounded-md shadow-lg">
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-white w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-white w-full px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-300"
                                >
                                    Signup
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
