import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { userRoute } from '../../components/constant';
import { setFriends, setUser } from '../../redux';
import GroupModal from '../GroupCreateDialog.jsx';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown state
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const handleLogout = async () => {
        setIsProfileOpen(false);
        try {
            const logout = await axios.get(`${userRoute}/logout`, { withCredentials: true });
            if (logout.data.success) {
                dispatch(setUser(null));
                dispatch(setFriends([]));
                setIsLoggedIn(false);
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        }
    }, [user]);

    const shouldShowHomeButton = location.pathname !== '/home' && isLoggedIn;

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
                        CashFlow
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
                                        onClick={() => {
                                            setShowGroupModal(true)
                                            console.log("button clicked")
                                        }}
                                        className="text-white px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800  transition-colors duration-300"
                                    >
                                        Create Group
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
                                    className="text-white px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800  transition-colors duration-300"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-white px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800  transition-colors duration-300"
                                >
                                    Signup
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu (visible only when open) */}
                {isMenuOpen && (
                    <div className="md:hidden flex flex-col space-y-4 mt-6">
                        {shouldShowHomeButton && (
                            <button
                                onClick={handleHomeClick}
                                className="text-white w-full px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                Home
                            </button>
                        )}
                        {isLoggedIn ? (
                            <>
                                {!shouldShowHomeButton && (
                                    <button
                                        onClick={() => setShowGroupModal(true)}
                                        className="text-white w-full px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        Create Group
                                    </button>
                                )}

                                {/* Profile dropdown in mobile */}
                                <div className="relative">
                                    <button
                                        onClick={toggleProfileDropdown}
                                        className="focus:outline-none w-full text-left"
                                    >
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt="Avatar"
                                            className="w-12 h-12 rounded-full mx-auto ring-2 ring-gray-400"
                                        />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-t-lg transition-all duration-300"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-b-lg transition-all duration-300"
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
                                    className="text-white w-full px-5 py-3 bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-white w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Signup
                                </button>
                            </>
                        )}
                    </div>
                )}
                {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} />}
            </div>

        </nav>
    );
};

export default Navbar;