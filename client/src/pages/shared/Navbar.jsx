import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, replace } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { notificationRoute, userRoute } from '../../components/constant';
import { setFriends, setUser } from '../../redux';
import GroupModal from '../GroupCreateDialog.jsx';
import Notification from './Notification.jsx';
import { useSocket } from './useSocket.jsx';


const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown state
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const socket = useSocket();
    const handleLogout = async () => {
        setIsProfileOpen(false);
        try {
            const logout = await axios.get(`${userRoute}/logout`, { withCredentials: true });
            if (logout.data.success) {
                dispatch(setUser(null));
                dispatch(setFriends([]));
                setIsLoggedIn(false);
                navigate('/', { replace: true })
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
    // for notifications
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const handlenotificationopne = () => {
        setNotificationsOpen(!notificationsOpen);
        showCountfun();
    }
    const showCountfun = () => {
        setShowCount(false);
    }
    const [showCount, setShowCount] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const getNotificationCount = async () => {
            try {
                const response = await axios.get(`${notificationRoute}/get-notifications`, { withCredentials: true });
                if (response.data.success) {
                    setCount(response.data.notifications.length);
                    setShowCount(true);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                return 0;
            }
        }
        getNotificationCount();
    }, [])
    useEffect(() => {
        if (!socket) return;
        socket.on('new-notification', (notification) => {
            console.log("its working")
            setCount((prevCount) => prevCount + 1);
            setShowCount(true);
        });
    }, [socket])

    return (
        <nav className="bg-gray-800 fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-white text-lg font-semibold">
                        CashFlow
                    </Link>

                    {/* Main Navigation Items - All in one line for both mobile and desktop */}
                    <div className="flex items-center space-x-3">
                        {/* Notification Bell */}
                        {user && (
                            <div
                                className='relative px-3 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-950 cursor-pointer transition-colors duration-300'
                                onClick={handlenotificationopne}
                            >
                                <Bell size={20} />
                                {(showCount && count > 0) && (
                                    <div className='absolute -top-1 -right-1 w-4 h-4 bg-red-800 text-xs text-white flex items-center justify-center rounded-full'>
                                        {count}
                                    </div>
                                )}
                                {notificationsOpen && <Notification notificationsOpen={notificationsOpen} />}
                            </div>
                        )}

                        {/* Home Button */}
                        {shouldShowHomeButton && (
                            <button
                                onClick={handleHomeClick}
                                className="text-white px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-950 transition-colors duration-300 text-sm"
                            >
                                Home
                            </button>
                        )}

                        {/* Create Group Button - Show on larger screens */}
                        {isLoggedIn && !shouldShowHomeButton && (
                            <button
                                onClick={() => {
                                    setShowGroupModal(true);
                                    console.log("button clicked");
                                }}
                                className="hidden md:block text-white px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm"
                            >
                                Create Group
                            </button>
                        )}

                        {/* Profile/Auth Buttons */}
                        {isLoggedIn ? (
                            <div className="relative">
                                <button onClick={toggleProfileDropdown} className="focus:outline-none">
                                    <img
                                        src={user?.profilePic}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full ring-2 ring-gray-400"
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => {
                                                toggleProfileDropdown();
                                                navigate('/profile');
                                            }}
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
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-white px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-white px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm"
                                >
                                    Signup
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} />}
            </div>
        </nav>
    );
};

export default Navbar;