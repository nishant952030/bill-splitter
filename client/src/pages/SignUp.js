import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { userRoute } from '../components/constant';
import { setUser } from '../redux';

const SignUp = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [signingUp, setSigningUp] = useState(false);
    const [openVerification, setOpenVerification] = useState(false);
    const [otp, setOtp] = useState(""); // OTP state
    const [otpMessage, setOtpMessage] = useState("");
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            setSigningUp(true);
            const response = await axios.post(`${userRoute}/signup-otp`, {
                name,
                username,
                email,
                password,
            }, { withCredentials: true });
            if (response.data.success) {
                setMessage(response.data.message);
                setOpenVerification(true);  // Open OTP input dialog
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

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${userRoute}/verify-otp`, {
                email,
                otp,
            }, { withCredentials: true });
            if (response.data.success) {
                setOtpMessage("OTP verified successfully!");
                dispatch(setUser(response.data.data));
                setTimeout(() => {
                    navigate("/home",{replace:true}); // Redirect to home page after successful verification
                }, 1000);
            } else {
                setOtpMessage("Invalid OTP. Please try again.");
            }
        } catch (error) {
            setOtpMessage("Error verifying OTP. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">Expense Tracker</h1>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Sign Up</h2>

                {/* Sign Up Form */}
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

            {/* OTP Verification Dialog */}
            {openVerification && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-80 max-w-md">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Verify OTP</h3>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium">Enter OTP:</label>
                            <input
                                type="text"
                                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 transition duration-300"
                        >
                            Verify OTP
                        </button>

                        {otpMessage && (
                            <p className={`mt-4 text-center ${otpMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                                {otpMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
