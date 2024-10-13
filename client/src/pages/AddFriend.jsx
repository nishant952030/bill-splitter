import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const AddFriend = () => {
    const [data, setData] = useState(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch.length < 3) return setData([]);

        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:8000/search/search-user", {
                    params: { username: debouncedSearch },
                    withCredentials: true,
                });
                if (response.data.success) {
                    setData(response.data.data);
                    setResponse(response.data);
                    console.log("response after  making search",response)
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [debouncedSearch]);

    const handleAddFriend = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/search/add-user/${id}`, { withCredentials: true });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="p-4 mt-20">
            {/* Search Bar */}
            <div className="flex  sm:flex-row gap-3 w-full md:w-3xl mx-auto">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by username..."
                    className="flex-grow w-[20rem] sm:w-96 h-12 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className='bg-gray-800 w-20 flex justify-center items-center text-white h-12 rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300'>
                    <Search />
                </button>
            </div>

            {/* Results or Loader */}
            {isLoading ? (
                <li className='flex justify-center items-center'><ClipLoader
                    loading={isLoading}
                    size={26}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    className='mt-9'
                /></li>
            ) : (
                debouncedSearch.length >= 3 && (
                    data && data.username ? (
                        <div className='bg-gray-100 rounded-md mt-4 p-4 flex flex-col md:flex-row justify-between items-center'>
                            <div className='text-gray-700'>
                                <p>Name: <span className='ml-1 uppercase'>{data.name}</span></p>
                                <p>Username: <span className='ml-1'>{data.username}</span></p>
                                </div>
                                {response.me ? "" :
                                    (
                                        response.isFriend ? (
                                            <button
                                                className='w-full md:w-20 mt-4 md:mt-0 h-10 bg-gray-800 text-white rounded hover:bg-gray-700 cursor-not-allowed'
                                                disabled
                                            >
                                                Friends
                                            </button>
                                        ) : response.status === 'pending' ? (
                                            <button
                                                className='w-full md:w-20 mt-4 md:mt-0 h-10 bg-gray-800 text-white rounded hover:bg-gray-700'
                                                disabled
                                            >
                                                Requested
                                            </button>
                                        ) : response.status === 'rejected' ? (
                                            <div className='flex flex-col'>
                                                <span className='text-gray-500'>Rejected</span>
                                                <button
                                                    className='mt-2 w-full md:w-20 h-10 bg-gray-800 text-white rounded hover:bg-gray-700'
                                                    onClick={() => handleAddFriend(data._id)} // Function to send a new friend request
                                                >
                                                    Send Request
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className='w-full md:w-20 mt-4 md:mt-0 h-10 bg-gray-800 text-white rounded hover:bg-gray-700'
                                                onClick={() => handleAddFriend(data._id)} // Function to send a friend request
                                            >
                                                Add
                                            </button>
                                        )
                                    )}
                        </div>
                    ) : (
                        <div className='flex justify-center items-center bg-gray-100 rounded-md mt-4 p-4'>
                            No users found
                        </div>
                    )
                )
            )}
        </div>
    );
};

export default AddFriend;