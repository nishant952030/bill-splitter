import React from 'react';
import { ArrowRight, Clock, Check, X } from 'lucide-react';

const ChatMessage = ({ message, splitwith }) => {
    const isOutgoing = message.createdWith[0] === splitwith;
    console.log(message.createdWith[0]);
    const statusIcon = {
        pending: <Clock className="w-5 h-5" />,
        approved: <Check className="w-5 h-5 text-green-500" />,
        rejected: <X className="w-5 h-5 text-red-500" />
    };

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
                        <span className={`font-bold text-xl mr-1 ${isOutgoing ? 'text-green-400' : 'text-red-500'}`}>₹{message.splitAmount}</span>
                        <ArrowRight className="w-5 h-5 mx-1" />
                        <span className="text-base text-gray-600">₹{message.amount} Total</span>
                    </div>
                    <div className="flex items-center bg-white px-3 py-1 rounded-full">
                        <span className="text-sm mr-2 capitalize">{message.status}</span>
                        {statusIcon[message.status]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;