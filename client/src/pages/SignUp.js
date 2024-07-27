import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [signingUp, setSigningUp] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            setSigningUp(true);
            const response = await axios.post('http://localhost:8000/user/signup', {
                name,
                email,
                password,
                profile_pic: ''
            });

            setMessage(response.data.message);
            console.log(response.data);
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
            
                navigate("/home");
            
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-600">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">Expense Tracker</h1>
                <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
                <div className="mb-4">
                    <label className="block text-white">Name:</label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Email:</label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Password:</label>
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
                    {signingUp ? <ClipLoader size={30} color={"white"} loading={true} /> : "Sign Up"}
                </button>

                {message ? (
                    <p className={`mt-4 text-center ${message === "User created successfully" ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                ) : null}
                <div className="text-center mt-4 text-blue-200 cursor-pointer" onClick={() => navigate('/login')}>
                    Login?
                </div>
            </div>
        </div>
    );
};

export default SignUp;
