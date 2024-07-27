import React, { useState } from 'react';
import axios from 'axios';
import navigate from "re"
const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const handleClick = async () => {
        try {
            const response = await axios.post('http://localhost:8000/user/signup', {
                name,
                email,
                password,
                profile_pic: '' 
            });
            setMessage(response.data.message);
            console.log(response.data)
        } catch (error) {
            if (error.response) {
           
                setMessage(error.response.data.message);
            } else if (error.request) {
               
                setMessage("No response from the server.");
            } else {
               
                setMessage("Error in making the request.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Name:</label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    onClick={handleClick}
                >
                    Sign Up
                </button>
                {message === "User created successfully" ? <p className="mt-4 text-center text-green-500">{message}</p> : <p className="mt-4 text-center text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default SignUp;
