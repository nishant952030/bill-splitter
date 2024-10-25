import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notificationRoute } from '../../components/constant';
import { useNavigate } from 'react-router-dom';
import { useSocket } from './useSocket';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    
    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            const handleNewNotification = (notification) => {
                console.log('Received new notification:', notification);
                setNotifications((prevNotifications) => {
                    return [notification, ...prevNotifications];
                });
            };
            socket.on('new-notification', handleNewNotification);
            return () => {
                socket.off('new-notification', handleNewNotification);
            };
        }
    }, [socket]);

    
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${notificationRoute}/get-notifications`, { withCredentials: true });
                setNotifications(res.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);
     


    // Function to handle viewing a specific notification
    const viewNotification = async (notification) => {
        try {
            const res = await axios.get(`${notificationRoute}/update-notification/${notification._id}`, { withCredentials: true });
            if (res.data.success) {
                setNotifications((prev) => prev.filter((ele) => ele._id !== notification._id));
                if (notification.type === 'expense') {
                    navigate(`/home/user/${notification.createdBy._id}`);
                } else if (notification.type === 'friendRequest') {
                    navigate(`/friends`);
                }
                // Add more navigation actions for different types of notifications
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Function to handle marking all notifications as seen
    const markAllSeen = async () => {
        try {
            const res = await axios.get(`${notificationRoute}/mark-all-seen`, { withCredentials: true });
            if (res.data.success) {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error marking all notifications as seen:', error);
        }
    };

    // Function to render different notification types
    const renderNotification = (notification) => {
        switch (notification.type) {
            case 'friendRequest':
                return (
                    <div
                        key={notification._id}
                        onClick={() => viewNotification(notification)}
                        className="relative flex items-center bg-blue-100 p-3 rounded-lg shadow-md hover:bg-blue-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-semibold mr-3">
                            FR
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{notification.createdBy.name}</span>
                            <span className="text-sm text-gray-600">sent you a friend request</span>
                        </div>
                    </div>
                );
            case 'expense':
                return (
                    <div
                        key={notification._id}
                        onClick={() => viewNotification(notification)}
                        className="relative flex items-center bg-green-100 p-3 rounded-lg shadow-md hover:bg-green-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-200 text-green-700 font-semibold mr-3">
                            $
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{notification.createdBy.name||notification.name}</span>
                            <span className="text-sm text-gray-600">has split a bill of ₹{notification.amount}</span>
                        </div>
                    </div>
                );
            case 'systemAlert':
                return (
                    <div
                        key={notification._id}
                        className="relative flex items-center bg-red-100 p-3 rounded-lg shadow-md hover:bg-red-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-200 text-red-700 font-semibold mr-3">
                            !
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">System Alert</span>
                            <span className="text-sm text-gray-600">{notification.message}</span>
                        </div>
                    </div>
                );
            // Add more notification types here
            default:
                return (
                    <div
                        key={notification._id}
                        className="relative flex items-center bg-gray-100 p-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold mr-3">
                            ?
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{notification.message}</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`h-[60vh] w-96 top-20 right-0 flex flex-col gap-4 p-4 bg-gray-800 absolute transition-transform duration-500 ease-in-out overflow-y-auto shadow-lg rounded-md`}>
            <div className='flex justify-between'>
                <div className='text-white'>
                    {notifications.length} unseen
                </div>
                <div className='px-3 py-2 bg-gray-700 text-white cursor-pointer' onClick={markAllSeen}>
                    Mark all seen
                </div>
            </div>

            {/* Notification list */}
            {loading ? (
                <div className="text-white text-center">Loading...</div>
            ) : notifications.length > 0 ? (
                notifications.map((notification) => renderNotification(notification))
            ) : (
                <div className="text-white text-center">No notifications</div>
            )}
        </div>
    );
};

export default Notification;
