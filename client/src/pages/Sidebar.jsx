import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ChevronRight, ChevronLeft } from 'lucide-react'; // Import arrow icons
import Switch from "react-switch";

const Sidebar = () => {
    const contacts = useSelector((store) => store.user.contacts);
   
    const groups = [
        {
            _id: 'group1',
            name: 'Study Group',
            members: [
                { userId: 'user1', joinedAt: new Date('2023-08-01') },
                { userId: 'user2', joinedAt: new Date('2023-08-05') },
                { userId: 'user3', joinedAt: new Date('2023-08-10') }
            ],
            expenses: [
                {
                    amount: 150,
                    description: 'Books Purchase',
                    paidBy: {
                        userId: 'user1',
                        paidAt: new Date('2023-09-01'),
                    },
                    createdAt: new Date('2023-09-01'),
                },
                {
                    amount: 200,
                    description: 'Group Lunch',
                    paidBy: {
                        userId: 'user2',
                        paidAt: new Date('2023-09-05'),
                    },
                    createdAt: new Date('2023-09-05'),
                },
            ],
            createdAt: new Date('2023-07-20'),
            updatedAt: new Date('2023-09-10'),
        },
        {
            _id: 'group2',
            name: 'Workout Buddies',
            members: [
                { userId: 'user2', joinedAt: new Date('2023-08-12') },
                { userId: 'user4', joinedAt: new Date('2023-08-15') }
            ],
            expenses: [
                {
                    amount: 50,
                    description: 'Gym Membership',
                    paidBy: {
                        userId: 'user4',
                        paidAt: new Date('2023-09-10'),
                    },
                    createdAt: new Date('2023-09-10'),
                }
            ],
            createdAt: new Date('2023-08-01'),
            updatedAt: new Date('2023-09-12'),
        },
        {
            _id: 'group3',
            name: 'Gaming Clan',
            members: [
                { userId: 'user1', joinedAt: new Date('2023-08-20') },
                { userId: 'user3', joinedAt: new Date('2023-08-22') },
                { userId: 'user4', joinedAt: new Date('2023-08-25') }
            ],
            expenses: [
                {
                    amount: 100,
                    description: 'Game Purchase',
                    paidBy: {
                        userId: 'user1',
                        paidAt: new Date('2023-09-15'),
                    },
                    createdAt: new Date('2023-09-15'),
                },
                {
                    amount: 75,
                    description: 'In-game Items',
                    paidBy: {
                        userId: 'user3',
                        paidAt: new Date('2023-09-18'),
                    },
                    createdAt: new Date('2023-09-18'),
                },
            ],
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-09-20'),
        },
    ];


    const navigate = useNavigate(); // Initialize navigate hook
   
    const handleClick = (id) => {
        navigate(`/home/user/${id}`); // Navigate to the user/:id route
    };

    const handleGroupClick = (id) => {
        navigate(`/home/group/${id}`); // Navigate to the group/:id route
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [activeTab, setActiveTab] = useState('contacts'); // State to manage active tab (contacts or groups)
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            if (window.innerWidth < 840) {
                setIsSidebarVisible(false);
            } else {
                setIsSidebarVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab); // Change the active tab
    };

    return (
        <div>
            {screenWidth < 840 && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-80 left-0 p-2 bg-gray-600 text-white rounded-r-lg focus:outline-none z-50"
                >
                    {isSidebarVisible ? <ChevronLeft /> : <ChevronRight />}
                </button>
            )}

            <div className={`${isSidebarVisible ? 'absolute left-0' : '-left-96'} ${screenWidth < 840 ? 'absolute' : 'relative'} transition-all duration-300 ease-in-out flex flex-col w-96 bg-gray-100 rounded-lg p-4 py-7 h-full z-20`}>

                <h1 className="text-2xl font-bold mb-6 text-gray-800">Contacts & Groups</h1>

                <div className="flex justify-around mb-4">
                    <button
                        onClick={() => handleTabChange('contacts')}
                        className={`p-2 rounded-lg ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out`}
                    >
                        Contacts
                    </button>
                    <button
                        onClick={() => handleTabChange('groups')}
                        className={`p-2 rounded-lg ${activeTab === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out`}
                    >
                        Groups
                    </button>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === 'contacts' ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className="flex-grow overflow-y-scroll">
                        {contacts.length > 0 ? (
                            contacts.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => {
                                        if (screenWidth < 840) {
                                            setIsSidebarVisible(false);
                                        }
                                        handleClick(user._id);
                                    }}
                                    className="p-4 bg-white rounded-lg mb-2 shadow hover:shadow-md hover:bg-gray-50 transition duration-300 ease-in-out cursor-pointer"
                                >
                                    <h2 className="text-lg font-semibold mb-1 text-gray-700 capitalize">
                                        {user.name}
                                    </h2>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-600 flex justify-center items-center h-full">Add contacts</div>
                        )}
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === 'groups' ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className="flex-grow overflow-y-scroll">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <div
                                    key={group._id}
                                    onClick={() => {
                                        if (screenWidth < 840) {
                                            setIsSidebarVisible(false);
                                        }
                                        handleGroupClick(group._id);
                                    }}
                                    className="p-4 bg-white rounded-lg mb-2 shadow hover:shadow-md hover:bg-gray-50 transition duration-300 ease-in-out cursor-pointer"
                                >
                                    <h2 className="text-lg font-semibold mb-1 text-gray-700 capitalize">
                                        {group.name}
                                    </h2>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-600 flex justify-center items-center h-full">No groups available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
