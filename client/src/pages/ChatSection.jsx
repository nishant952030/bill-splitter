import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Store } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import ChatMessage from './Chat';
import { expenseRoute, notificationRoute, userRoute } from '../components/constant';
import { useSpring, animated } from '@react-spring/web';
import { useSocket } from './shared/useSocket';
import { useSelector } from 'react-redux';



const AnimatedNumber = ({ value }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { duration: 1000 },
  });
  return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>;
};

const ChatSection = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [dummy, setDummy] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);
  const {user}=useSelector(store => store.user);
  const socket = useSocket();
  const [take, setTake] = useState(0);
  const [give, setGive] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const response = await axios.get(`${userRoute}/get-details/${userId}`, { withCredentials: true });
        if (response.data.success) setData(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details.");
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!socket) return; // Check if socket is available

    const handleNewExpense = (newExpense) => {
      if (newExpense.createdBy._id === userId) {
        const newObject = {
          _id: newExpense._id,
          amount: newExpense.amount,
          splitAmount: newExpense.splitAmount,
          status: newExpense.status,
          confirmedByReciever: newExpense.confirmedByReciever,
          createdAt: newExpense.createdAt,
          description: newExpense.description,
          createdWith: newExpense.createdWith,
        };
        setDummy((prev) => [newObject, ...prev]);
      }
    };
    const updateCount = (message) => {
      if (message.createdBy === userId) {
        setGive(prev => { return prev - message.splitAmount });
      }
      if (message.createdWith[0] === userId) {
        setTake(prev=>{return prev-message.splitAmount})
      }
   }
    socket.on('new-expense', handleNewExpense);
    socket.on('update-count', updateCount);
    return () => {
      socket.off('new-expense', handleNewExpense);
    };
  }, [userId, socket]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setChatsLoading(true);
        const response = await axios.get(`${expenseRoute}/all-expenses/${userId}`, { withCredentials: true });
        setDummy(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch expenses.");
      } finally {
        setChatsLoading(false);
      }
    };
    fetchChats();
  }, [userId]);

  useEffect(() => {
    setChats(dummy);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [dummy]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount.trim() || isNaN(Number(amount.trim())) || !description.trim()) {
      alert("Please enter a valid amount and description.");
      return;
    }

    const newExpense = {
      amount: Number(amount.trim()),
      description: description.trim(),
    };

    try {
      setSendLoading(true);
      const response = await axios.post(`${expenseRoute}/create-expense/${userId}`, newExpense, { withCredentials: true });

      if (response.data.success && socket && socket.connected) {
        const newExpenseData = response.data.expense;

        // Create the new object for local state
        const newObject = {
          _id: newExpenseData._id,
          amount: newExpenseData.amount,
          splitAmount: newExpenseData.splitAmount,
          status: newExpenseData.status,
          confirmedByReceiver: newExpenseData.confirmedByReceiver,
          createdAt: newExpenseData.createdAt,
          description: newExpenseData.description,
          createdWith: [newExpenseData.createdWith[0]._id],
        };

        // Update local state
        setDummy((prev) => [newObject, ...prev]);

        // Emit the new expense to the socket
        socket.emit('new-expense', newExpenseData);

        // Create notification (should be awaited here)
        const notification = await axios.post(`${notificationRoute}/create-notification/${userId}`, {
          amount: newExpense.amount,
          createdWith: newObject.createdWith,
          description: newExpense.description,
          type: "expense",
          name:user.name
       }, { withCredentials: true });
        if (notification) {
           console.log(notification)
        }
      }

      // Reset input fields
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding expense:', error);
      setError("Failed to add expense.");
    } finally {
      setSendLoading(false);
    }

  };

  useEffect(() => {
    const fetchtotal = () => {
      const { takeTotal, giveTotal } = dummy.reduce(
        (acc, chat) => {
          const isOutgoing = chat.createdWith[0] === userId;
          const completeSettle = chat.status === "settled" || chat.confirmedByReciever;
          if (!completeSettle) {
            if (isOutgoing) acc.takeTotal += chat.splitAmount;
            else acc.giveTotal += chat.splitAmount;
          }
          return acc;
        },
        { takeTotal: 0, giveTotal: 0 }
      );
      setTake(takeTotal);
      setGive(giveTotal);
    };
    fetchtotal();
  }, [dummy, userId]);

  return (
    <div className="ml-2 flex flex-col max-h-[91vh] bg-gray-100 w-full max-w-5xl">
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {data?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{data?.name}</h2>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="p-2 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-lg flex items-center">
            <span className="text-sm font-medium">Give</span>
            <span className="text-2xl ml-2">₹<AnimatedNumber value={give} /></span>
          </div>
          <div className="p-2 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-lg flex items-center">
            <span className="text-sm font-medium">Take</span>
            <span className="text-2xl ml-2">₹<AnimatedNumber value={take} /></span>
          </div>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex flex-col-reverse overflow-y-auto p-4 space-y-4">
        {chats.length === 0 ? (
          <h1 className='text-center pb-3'>No Gain No Pain</h1>
        ) : (
          chats.map((chat, index) => <ChatMessage key={index} message={chat} splitwith={userId} />)
        )}
      </div>

      <div className="bg-gray-200 h-16 w-full rounded-lg p-4 flex items-center justify-between">
        <input
          type='text'
          placeholder='Amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='rounded-full p-2 w-1/4 focus:outline-none'
        />
        <input
          type='text'
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='rounded-full p-2 w-full mx-2 focus:outline-none'
        />
        <button
          onClick={handleAddExpense}
          className='bg-gray-600 w-16 flex justify-center text-white rounded-lg p-2 hover:bg-gray-800 transition duration-300'
        >
          {sendLoading ? <ClipLoader size={23} /> : <Send />}
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
