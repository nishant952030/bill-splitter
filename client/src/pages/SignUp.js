import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux';

const SignUp = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState(""); // Added username state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [signingUp, setSigningUp] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleClick = async () => {
        try {
            setSigningUp(true);
            const response = await axios.post('http://localhost:8000/user/signup', {
                name,
                username,
                email,
                password,
            });
            if (response.data.success) {
                setMessage(response.data.message);
                console.log(response.data);
                dispatch(setUser(response.data.data))
                navigate("/login");
            }

        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else if (error.request) {
                setMessage("No response from the server.");
            } else {
                setMessage("Error in making the request.");
            }
        } finally {
            setSigningUp(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">Expense Tracker</h1>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Sign Up</h2>

                <div className="mb-4">
                    <label className="block text-gray-600 font-medium">Name:</label>
                    <input
                        type="text"
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 font-medium">Username:</label>
                    <input
                        type="text"
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 font-medium">Email:</label>
                    <input
                        type="text"
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 font-medium">Password:</label>
                    <input
                        type="password"
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 transition duration-300"
                    onClick={handleClick}
                >
                    {signingUp ? <ClipLoader size={30} color={"white"} loading={true} /> : "Sign Up"}
                </button>

                {message ? (
                    <p className={`mt-4 text-center ${message === "User created successfully" ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                ) : null}

                <div className="text-center mt-4 text-gray-500 cursor-pointer hover:text-gray-800 transition duration-300" onClick={() => navigate('/login')}>
                    Already have an account? Login
                </div>
            </div>
        </div>
    );
};

export default SignUp;
