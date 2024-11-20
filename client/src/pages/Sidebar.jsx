import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { groupRoute } from '../components/constant';
import axios from 'axios';

const Sidebar = () => {
    const contacts = useSelector((store) => store.user.contacts);

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/home/user/${id}`);
    };

    const handleGroupClick = (id) => {
        navigate(`/home/group/${id}`);
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [activeTab, setActiveTab] = useState('contacts');

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

    const [groups, setGroups] = useState([]);
    const handleTabChange = async (tab) => {
        setActiveTab(tab);

        if (tab === 'groups') {
            try {
                const response = await axios.get(`${groupRoute}/get-groups`, { withCredentials: true });

                if (response.data.success) {
                    setGroups(response.data.groups);
                } else {
                    console.error("Failed to fetch groups:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching groups:", error.message);
            }
        }
    };


    return (
        <div className='h-[90vh]'>
            {screenWidth < 840 && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-80 left-0 p-2 bg-gray-600 text-white rounded-r-lg focus:outline-none z-50"
                >
                    {isSidebarVisible ? <ChevronLeft /> : <ChevronRight />}
                </button>
            )}

            <div className={`${isSidebarVisible ? 'absolute left-0' : '-left-96'} ${screenWidth < 840 ? 'absolute' : 'relative'} transition-all duration-300 ease-in-out flex flex-col w-96 bg-gray-100 rounded-lg p-4 pt-7 h-full z-20`}>
                <div className="flex justify-around mb-4">
                    <button
                        onClick={() => handleTabChange('contacts')}
                        className={`p-2 rounded-lg ${activeTab === 'contacts' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out`}
                    >
                        Contacts
                    </button>
                    <button
                        onClick={() => handleTabChange('groups')}
                        className={`p-2 rounded-lg ${activeTab === 'groups' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out`}
                    >
                        Groups
                    </button>
                </div>

                <div className={`transition-all overflow-y-scroll duration-300 ease-in-out ${activeTab === 'contacts' ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className="flex flex-col overflow-y-scroll">
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
                                    className="p-3 bg-white rounded-lg mb-2 shadow hover:shadow-md hover:bg-gray-50 transition duration-300 ease-in-out cursor-pointer"
                                >
                                    <div className='flex gap-3'>
                                        <div className='w-12 h-12 bg-slate-400 rounded-full'>
                                       <img  className="rounded-full w-12 h-12" src={user.profilePic}></img>
                                        </div>
                                        <h2 className="text-lg font-semibold mb-1 text-gray-700 capitalize">
                                            {user.name}
                                        </h2>

                                    </div>
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
