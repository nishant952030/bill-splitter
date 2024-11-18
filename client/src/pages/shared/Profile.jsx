import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { searchRoute } from '../../components/constant';
import ExpenseChar from '../ExpenseChar';

const RequestsTable = ({ requests }) => {
    const [acceptloading, setacceptLoading] = useState(false);
    const [rejecttloading, setrejecttLoading] = useState(false);
    const [allRequests, setAllRequests] = useState(requests);
    console.log(allRequests);
    const handleAction = async (request, action) => {
        try {
            if (action === 'accept') {
                setacceptLoading(true);
            } else if (action === 'reject') {
                setrejecttLoading(true);
            }
        
            const response = await axios.get(`${searchRoute}/action/${request.senderId._id}/${request._id}/${action}`, { withCredentials: true });
            if (response.data.success) {
                
            }
            console.log(response);
        } catch (error) {
            console.error(error);
        }
        finally {
           if (action === 'accept') {
                setacceptLoading(false);
            } else if (action === 'reject') {
                setrejecttLoading(false);
            }
        }
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-4 px-6 text-left font-semibold">Name</th>
                        <th className="py-4 px-6 text-left font-semibold">Username</th>
                        <th className="py-4 px-6 text-left font-semibold">Date</th>
                        <th className="py-4 px-6 text-left font-semibold">Status</th>
                        <th className="py-4 px-6 text-left font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {allRequests.map((request) => (
                        <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{request?.senderId?.name}</td>
                            <td className="py-3 px-6 text-left">{request?.senderId?.username}</td>
                            <td className="py-3 px-6 text-left">{new Date(request?.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-left">{request?.status}</td>
                            <td className="py-3 px-6">
                                <div className="flex gap-4">
                                            <button
                                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-200"
                                                onClick={() => {
                                                    console.log(`Clicked accept for ${request._id}`);
                                                    handleAction(request, 'accept');
                                                }}
                                                disabled={acceptloading}
                                            >
                                                {acceptloading?'wait...':'Accept'}
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-200"
                                                onClick={() => {
                                                    console.log(`Clicked reject for ${request._id}`);
                                                    handleAction(request, 'reject');
                                                }}
                                                disabled={rejecttloading}
                                            >
                                                {rejecttloading?'wait...':'Reject'}
                                            </button>
                                        </div>
                                    
                                      <div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Profile = () => {
    const { user } = useSelector(store => store.user);
    const [userData, setUserData] = useState(user);
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${searchRoute}/profile`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    console.log(response);
                    setRequests(response.data.data);
                }
            } catch (err) {
                setError('Failed to load user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 mt-20">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-gray-800 to-slate-600 text-white">
                    <div className="flex items-center space-x-6">
                        <img
                            src={userData.avatar || '/api/placeholder/150/150'}
                             alt=""
                            className="rounded-full w-32 h-32 border-4 border-white shadow-lg"
                        />
                        <div>
                            <h2 className="text-3xl font-bold uppercase">{userData.name}</h2>
                            <p className="text-xl">@{userData.username}</p>
                            <p className="text-lg mt-2">{userData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">Requests</h3>
                    {requests.length > 0 ? (
                        <RequestsTable requests={requests} setRequests={setRequests} />
                    ) : (
                        <p className="text-gray-600 text-center py-4">No requests found.</p>
                    )}
                </div>
            </div>
            <ExpenseChar/>
        </div>
    );
};
export default Profile; 