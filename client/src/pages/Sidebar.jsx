import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ChevronRight, ChevronLeft } from 'lucide-react'; // Import arrow icons

const Sidebar = () => {
    const contacts = useSelector((store) => store.user.contacts);
    const navigate = useNavigate(); // Initialize navigate hook

    const handleClick = (id) => {
        navigate(`/home/user/${id}`); // Navigate to the user/:id route
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); 

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            if (window.innerWidth < 720) {
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

    return (
        <div>
         
            {screenWidth < 720 && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-80 left-0 p-2 bg-gray-600 text-white rounded-r-lg  focus:outline-none z-50"
                >
                    {isSidebarVisible ? <ChevronLeft /> : <ChevronRight className="" />}
                </button>
            )}

            
            <div
                className={`${isSidebarVisible ? 'absolute left-0' : '-left-96'
                    } ${screenWidth < 720 ? 'absolute' : 'relative'} transition-all duration-300 ease-in-out flex flex-col w-96 bg-gray-100 rounded-lg p-4 min-h-screen z-20`}
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Contacts</h1>
                <div className="flex-grow overflow-y-scroll">
                    {contacts.length > 0 ? (
                        contacts.map((user) => (
                            <div
                                key={user.id} 
                                onClick={() => handleClick(user._id)} 
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
        </div>
    );
};

export default Sidebar;
