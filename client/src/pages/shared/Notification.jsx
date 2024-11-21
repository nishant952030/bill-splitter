import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notificationRoute, userRoute } from '../../components/constant';
import { useNavigate } from 'react-router-dom';
import { useSocket } from './useSocket';
import { Fullscreen } from 'lucide-react';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            const handleNewNotification = async (notification) => {
                console.log("Received new notification:", notification);
                if (notification.type === 'paidExpense' && notification.createdBy) {
                    notification.createdByName =notification.createdBy.name;
                }
                setNotifications((prevNotifications) => [notification, ...prevNotifications]);
            };

            socket.on('new-notification', handleNewNotification);
            return () => {
                socket.off('new-notification', handleNewNotification);
            };
        }
    }, [socket]);

    // Fetch notifications on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${notificationRoute}/get-notifications`, { withCredentials: true });
                const notificationsWithNames = await Promise.all(
                    res.data.notifications.map(async (notification) => {
                        if (notification.type === 'paidExpense' && notification.createdBy) {
                            notification.createdByName = notification.createdBy.name;
                        }
                        return notification;
                    })
                );
                setNotifications(notificationsWithNames);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    // Mark all notifications as seen
    const markAllSeen = async () => {
        try {
            await axios.get(`${notificationRoute}/mark-all-seen`, { withCredentials: true });
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    seen: true,
                }))
            );
        } catch (error) {
            console.error("Error marking all notifications as seen:", error);
        }
    };

    // Function to handle viewing a friend request
    const viewRequest = (notification) => {
        navigate(`/friend-requests/${notification._id}`);
    };

    // Function to handle viewing an expense notification
    const viewNotification = (notification) => {
        console.log("Viewing notification:", notification);
        navigate(`/home/user/${notification.createdBy._id}`);
    };
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [fullScreen, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            if (window.innerWidth < 470) {
                setIsSidebarVisible(true);
            } else {
                setIsSidebarVisible(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // Render different types of notifications
    const renderNotification = (notification) => {
        switch (notification.type) {
            case 'friendRequest':
                return (
                    <div
                        key={notification._id}
                        onClick={() => viewRequest(notification)}
                        className="relative flex items-center bg-blue-100 p-3 rounded-lg shadow-md hover:bg-blue-200 transition-all duration-300 ease-in-out transform hover:scale-105">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-semibold mr-3">
                            FR
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                                {notification.message}
                            </span>
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
                            ₹
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{notification.createdBy.name || notification.name}</span>
                            <span className="text-sm text-gray-600">has split a bill of ₹{notification.amount}</span>
                        </div>
                    </div>
                );
            case 'paidExpense':
                return (
                    <div
                        onClick={() => viewNotification(notification)}
                        key={notification._id}
                        className="relative flex items-center bg-green-100 p-3 rounded-lg shadow-md hover:bg-green-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-200 text-green-700 font-semibold mr-3">
                            ₹
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{notification.createdByName || 'Unknown'}</span>
                            <span className="text-sm text-gray-600">{notification.message}</span>
                        </div>
                    </div>
                );
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
        <div className={`h-[60vh] ${fullScreen ? "w-[100vw] top-16 -right-12" :"w-96 top-16 right-0"}  flex flex-col gap-4 pb-4 bg-gray-800 absolute transition-transform duration-500 ease-in-out overflow-y-auto shadow-lg rounded-md`}>
            <div className="flex justify-between px-4 pt-4">
                <div className="text-white">
                    {notifications.length} unseen
                </div>
                <div className="px-3 py-2 bg-gray-700 text-white cursor-pointer" onClick={markAllSeen}>
                    Mark all seen
                </div>
            </div>
            <div className='overflow-y-scroll flex flex-col gap-2 p-4'>             {loading ? (
                <div className="text-white text-center">Loading...</div>
            ) : notifications.length > 0 ? (
                notifications.map((notification) => renderNotification(notification))
            ) : (
                <div className="text-white text-center">No notifications</div>
            )}
            </div>

        </div>
    );
};

export default Notification;
