import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className=' absolute top-6 right-8 z-50 bg-blue-500 w-24 h-12 rounded-lg flex justify-center align-middle text-white text-lg pt-2 cursor-pointer hover:bg-blue-600'>Join Group</div>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">Flatmates Expense Tracker</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-white mb-4">My Balance</h2>
                        <p className="text-white mb-4">See how much you owe and how much others owe you.</p>
                        <button
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            onClick={() => navigate('/my-balance')}
                        >
                            View My Balance
                        </button>
                    </div>

                    <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Expenses</h2>
                        <p className="text-white mb-4">Check the most recent expenses made by you and your flatmates.</p>
                        <button
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            onClick={() => navigate('/recent-expenses')}
                        >
                            View Recent Expenses
                        </button>
                    </div>

                    <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Expense</h2>
                        <p className="text-white mb-4">Add a new expense to share with your flatmates.</p>
                        <button
                            className="bg-blue-500  text-white p-2 rounded-md hover:bg-blue-600"
                            onClick={() => navigate('/add-expense')}
                        >
                            Add Expense
                        </button>
                    </div>

                    <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-white mb-4">Manage Participants</h2>
                        <p className="text-white mb-4">Add or remove participants from your flatmates group.</p>
                        <button
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            onClick={() => navigate('/participants')}
                        >
                            Manage Participants
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
