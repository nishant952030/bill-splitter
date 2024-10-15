import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import AddFriend from './AddFriend';
import Sidebar from './Sidebar';
import { RotateCcw, TimerReset } from 'lucide-react';
import { expenseRoute, userRoute } from '../components/constant';
import { useDispatch } from 'react-redux';
import { setFriends } from '../redux';

const Home = () => {
    const [recents, setRecents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const pathname = location.pathname;
    const [friendData, setFriendData] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const listUsers = async () => {
            try {
                const users = await axios.get(`${userRoute}/all-users`, { withCredentials: true });
                if (users.data.success) {
                    setFriendData(users.data.data);
                    dispatch(setFriends(users.data.data));
                }
                console.log(users);
            } catch (error) {
                console.log(error);
            }
        };
        listUsers();
    }, [dispatch]);
    const fetchRecentExpenses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching recent expenses...");
            const response = await axios.get(`${expenseRoute}/recent-expenses`, { withCredentials: true });
            console.log("Full response:", response);

            if (response.data && response.data.expenses && Array.isArray(response.data.expenses)) {
                console.log("Setting recents with:", response.data.expenses);
                setRecents(response.data.expenses);
            } else {
                console.log("No recent expenses found or invalid data format:", response.data);
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

    useEffect(() => {
        console.log("Recents updated:", recents);
    }, [recents]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Simplify the date format to MM/DD/YYYY or based on your locale
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isSmall = screenWidth < 840
    return (
        <>
            <div className={`flex h-full absolute left-0 w-full ${isSmall?"top-16":"top-20"}` }>
                <Sidebar />
                {pathname === '/home' && (
                    <div className={` p-6 ${isSmall ? "flex flex-col justify-start w-full " :"w-3/4"}`}>
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
                                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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