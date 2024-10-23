import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import AddFriend from './AddFriend';
import Sidebar from './Sidebar';
import { RotateCcw } from 'lucide-react';
import { expenseRoute, userRoute } from '../components/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../redux';
import { useSocket } from './shared/useSocket';

const Home = () => {
    const [recents, setRecents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const pathname = location.pathname;
    const dispatch = useDispatch();
    const socket = useSocket();
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if (socket && user?._id) {
            socket.emit('registerUser', user._id);

            return () => {
                socket.off('new-expense');
            };
        }
    }, [socket, user?._id]);


    // Fetch friends list
    useEffect(() => {
        const listUsers = async () => {
            try {
                const users = await axios.get(`${userRoute}/all-users`, { withCredentials: true });
                if (users.data.success) {
                    dispatch(setFriends(users.data.data));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        listUsers();
    }, [dispatch]);

    // Fetch recent expenses
    const fetchRecentExpenses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${expenseRoute}/recent-expenses`, { withCredentials: true });
            if (response.data?.expenses && Array.isArray(response.data.expenses)) {
                setRecents(response.data.expenses);
            } else {
                setError("No recent expenses found or invalid data format");
            }
        } catch (error) {
            console.error("Error fetching recent expenses:", error);
            setError("Failed to fetch recent expenses");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecentExpenses();
    }, [fetchRecentExpenses]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isSmall = screenWidth < 840;

    return (
        <>
            <div className={`flex h-fit absolute left-0 w-full ${isSmall ? "top-16" : "top-20"}`}>
                <Sidebar />
                {pathname === '/home' && (
                    <div className={`p-6 ${isSmall ? "flex flex-col justify-start w-full" : "w-3/4"}`}>
                        <AddFriend isSmall={isSmall} />
                        <div className="w-full max-w-3xl mb-6">
                            <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
                            <button onClick={fetchRecentExpenses} className="mb-4 px-4 py-2 bg-slate-800 text-white rounded">
                                <RotateCcw />
                            </button>
                            {isLoading ? (
                                <p className="text-center text-gray-500">Loading...</p>
                            ) : error ? (
                                <p className="text-center text-red-500">{error}</p>
                            ) : recents.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left">Date</th>
                                                <th className="py-3 px-4 text-left">Created By</th>
                                                <th className="py-3 px-4 text-left">Amount</th>
                                                <th className="py-3 px-4 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recents.map((recent, index) => (
                                                <tr key={recent._id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="py-3 px-4">{formatDate(recent.createdAt)}</td>
                                                    <td className="py-3 px-4 capitalize">{recent.createdBy?.name}</td>
                                                    <td className="py-3 px-4">₹{recent.amount}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${recent.status === 'settled'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {recent.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No transactions found.</p>
                            )}
                        </div>
                    </div>
                )}
                <Outlet />
            </div>
        </>
    );
};

export default Home;