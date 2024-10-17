import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { groupRoute } from '../components/constant';
import axios from 'axios';
import { Send, Receipt } from 'lucide-react';

const GroupChatSection = () => {
  const { groupId } = useParams();
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const chatContainerRef = useRef(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [data, setData] = useState({ data: [], userId: null });
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(0);
  const [dummy, setDummy] = useState(null)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setChatLoading(true);
        const response = await axios.get(`${groupRoute}/get-all-expenses/${groupId}`, { withCredentials: true });
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setChatLoading(false);
      }
    }
    fetchExpenses();
  }, [groupId,dummy]);

  useEffect(() => {
    const groupDetails = async () => {
      try {
        const response = await axios.get(`${groupRoute}/get-group-details/${groupId}`, { withCredentials: true });
        if (response.data.success) {
          setGroupName(response.data.groups[0].name);
          setMembers(response.data.groups[0].members.length);
        }
      } catch (error) {
        console.log(error);
      }
    };
    groupDetails();
  }, [groupId,dummy]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [data.data]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Add loading state


  const messages = data?.data || [];

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${groupRoute}/create-expense/${groupId}`, {
        amount: newAmount,
        description: newDescription,
      }, { withCredentials: true });

      if (response.data.success) {
        setDummy(response.data.expense);
        setNewAmount('');
        setNewDescription('');

      }
    } catch (error) {
      console.log(error);
    }
  };
  if (chatLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }
  return (
    <div className="ml-2 flex flex-col max-h-[91vh] bg-gray-100 w-full max-w-5xl">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{groupName}</h2>
            <p className="text-sm text-gray-500">Members: {members}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Total spent: {messages.length > 0 ? formatCurrency(messages.reduce((sum, msg) => sum + msg.amount, 0)) : formatCurrency(0)}
        </div>
      </div>

      {/* Expense Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.paidBy._id === data.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${message.paidBy._id === data.userId ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4" />
                <span className="font-semibold">
                  {message.paidBy._id === data.userId ? "You" : message.paidBy.name} added an expense
                </span>
              </div>

              <div className="text-2xl font-bold mb-2">
                {formatCurrency(message.amount)}
              </div>

              <div className="text-lg mb-2">
                {message.description}
              </div>

              <div className={`text-sm ${message.paidBy._id === data.userId ? 'text-blue-100' : 'text-gray-600'}`}>
                Pay • {formatCurrency(message.splitAmount)} per person
              </div>

              <div className={`text-xs mt-2 ${message.paidBy._id === data.userId ? 'text-blue-100' : 'text-gray-500'}`}>
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expense Input */}
      <form className="bg-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-none w-1/3">
            <div className="relative">

              <input
                type="text"
                
                value={newAmount}
                onChange={(e) => {
                  if(!isNaN(e.target.value))
                  setNewAmount(e.target.value)
                }}
                placeholder="Amount...₹"
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="What's this expense for?"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!newDescription.trim() || !newAmount}
            onClick={handleAddExpense}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupChatSection;