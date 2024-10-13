import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import AddFriend from './AddFriend';
import Sidebar from './Sidebar';
import { setFriends } from '../redux';
import { useDispatch, useSelector } from 'react-redux';
import { searchRoute, userRoute } from '../components/constant';
// Correct import path for setFriends

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [search, setSearch] = useState('');
    const [friendData, setFriendData] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const { dosts } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname;
    const transactions = [
        {
            createdDate: '2024-10-10',
            createdBy: 'John Doe',
            amount: 500,
            paidStatus: 'Paid',
        },
        {
            createdDate: '2024-10-08',
            createdBy: 'Jane Smith',
            amount: 300,
            paidStatus: 'Pending',
        },
        {
            createdDate: '2024-10-05',
            createdBy: 'Alice Johnson',
            amount: 1000,
            paidStatus: 'Paid',
        },
    ];
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (debouncedSearch.length >= 3) {
                    const user = await axios.get(`${searchRoute}/search-user`, {
                        params: { username: debouncedSearch },
                        withCredentials: true,
                    });
                    if (user.data.success) {
                        setData(user.data.data);
                    }
                    console.log(user);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (debouncedSearch) {
            fetchUser();
        }
    }, [debouncedSearch]);


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



    useEffect(() => {
        console.log("friends data ", friendData);
    }, [friendData]);
       return (
        <div className="flex">
            <Sidebar />

            {pathname === '/home' ? ( // Conditional rendering based on the current path
                <div className="w-3/4 p-6">
                    <AddFriend />

                    <div className="w-full max-w-3xl mb-6">
                        <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
                        {transactions.length > 0 ? (
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
                                        {transactions.map((transaction, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="py-3 px-4">{transaction.createdDate}</td>
                                                <td className="py-3 px-4">{transaction.createdBy}</td>
                                                <td className="py-3 px-4">₹{transaction.amount}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.paidStatus === 'Paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {transaction.paidStatus}
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
            ) : null} {/* Ensure there's a fallback for when the path is not '/home' */}

            <Outlet /> {/* Render child routes if any */}
        </div>
    );
};

export default Home;
