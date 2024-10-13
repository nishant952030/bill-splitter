import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar = () => {
    const contacts = useSelector((store) => store.user.contacts);
    const navigate = useNavigate(); // Initialize navigate hook

    const handleClick = (id) => {
        navigate(`/home/user/${id}`); // Navigate to the user/:id route
    };

    return (
        <div className="flex flex-col pt-20 w-96 bg-gray-100 rounded-lg p-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Contacts</h1>
            <div className="flex-grow overflow-y-scroll">
                {contacts.length > 0 ? (
                    contacts.map((user) => (
                        <div
                            key={user.id} // Assuming contacts have a unique 'id' property
                            onClick={() => handleClick(user._id)} // Add onClick to navigate to user/:id
                            className="p-4 bg-white rounded-lg mb-4 shadow hover:shadow-md hover:bg-gray-50 transition duration-300 ease-in-out cursor-pointer"
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
    );
};

export default Sidebar;
