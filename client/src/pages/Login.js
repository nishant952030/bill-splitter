import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  setToken, setUser } from '../redux';
import { userRoute } from '../components/constant';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async () => {
        try {
            setLoggingIn(true);
            const response = await axios.post(`${userRoute}/login`, {
                email,
                password,
            }, { withCredentials: true });
            console.log(response)
            if (response.data.success) {
                navigate("/home",{replace: true});
                setMessage(response.data.message);
                dispatch(setUser(response.data.data))
                console.log(response)
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
            setLoggingIn(false);

        }
    };



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">Expense Tracker</h1>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Login</h2>

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
                    {loggingIn ? <ClipLoader size={30} color={"white"} loading={true} /> : "Login"}
                </button>

                {message ? (
                    <p className={`mt-4 text-center ${message === "Login successful" ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                ) : null}

                <div className="text-center mt-4 text-gray-500 cursor-pointer hover:text-gray-800 transition duration-300" onClick={() => navigate('/signup')}>
                    Sign Up?
                </div>
            </div>
        </div>
    );
};

export default Login;
