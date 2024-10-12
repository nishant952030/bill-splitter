import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import AddFriend from './AddFriend';

const Home = () => {
    const navigate = useNavigate();
    const [data, setdata] = useState(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

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
        const func = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('No token found in localStorage');
                    return;
                }

                if (debouncedSearch.length >= 3) {
                    const user = await axios.get("http://localhost:8000/search/search-user", {
                        params: { username: debouncedSearch },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    if (user.data.success) {
                        setdata(user.data.data);
                    }
                    console.log(user);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (debouncedSearch) {
            func();
        }
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col items-center p-6">
            <AddFriend />
            {/* Expense Transactions */}
            <div className="w-full max-w-3xl">
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
    );
};

export default Home;