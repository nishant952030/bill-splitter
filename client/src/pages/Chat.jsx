import React, { useState } from 'react';
import { ArrowRight, Clock, Check, X } from 'lucide-react';
import axios from 'axios';
import { expenseRoute } from '../components/constant';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader

const ChatMessage = ({ message, splitwith }) => {
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const isOutgoing = message.createdWith[0] === splitwith;

    console.log("message", message.confirmedByReciever);
    const statusIcon = {
        pending: <Clock className="w-5 h-5" />,
        approved: <Check className="w-5 h-5 text-green-500" />,
        rejected: <X className="w-5 h-5 text-red-500" />
    };

    // Mark as Paid
    const handlePaid = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${expenseRoute}/update-expense/${id}`, { withCredentials: true });
            console.log("update response", response);
            setSettled(true); // Only set optimistic state after a successful response
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Receiver's Confirmation
    const receiverConfirmation = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${expenseRoute}/reciever-confirm/${id}`, { withCredentials: true });
            console.log("update response", response);
            setConfirm(true); // Only set optimistic state after a successful response
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const [confirm, setConfirm] = useState(message.confirmedByReciever);
    const [settled, setSettled] = useState(message.status === 'settled');

    return (
        <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} my-4`}>
            <div className={`w-3/4 ${isOutgoing ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-4 shadow-md`}>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-base text-gray-700">
                        {isOutgoing ? 'Take' : 'Give'}
                    </span>
                    <span className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                    </span>
                </div>
                <p className="text-base mb-3">{message.description}</p>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                        <span className={`font-bold text-xl mr-1 ${isOutgoing ? 'text-green-400' : 'text-red-500'}`}>
                            ₹{message.splitAmount}
                        </span>
                        <ArrowRight className="w-5 h-5 mx-1" />
                        <span className="text-base text-gray-600">₹{message.amount} Total</span>
                    </div>

                    <div className='flex flex-row gap-3'>
                        {message.status === 'settled' ? (
                            message.confirmedByReciever || confirm ? (
                                <div>
                                    <div className='p-3 bg-green-300 text-green-700 rounded-lg'>Settled</div>
                                </div>
                            ) : (
                                isOutgoing ? (
                                    <button
                                        className={`bg-gray-600 text-white p-2 rounded-md hover:bg-gray-800 transition duration-300 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                                        onClick={() => receiverConfirmation(message._id)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Confirm Payment'}
                                    </button>
                                ) : (
                                    <div className='text-red-500'>Not Confirmed by Receiver</div>
                                )
                            )
                        ) : (
                            <>
                                {!isOutgoing && (
                                    settled ? <div className='text-red-500'>Not Confirmed by Receiver</div> :
                                        <button
                                            className={`bg-gray-600 text-white p-2 rounded-md hover:bg-gray-800 transition duration-300 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                                            onClick={() => handlePaid(message._id)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Paid?'}
                                        </button>
                                )}
                                <div className="flex items-center bg-white px-3 py-1 rounded-full">
                                    <span className="text-sm mr-2 capitalize">{message.status}</span>
                                    {statusIcon[message.status]}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
