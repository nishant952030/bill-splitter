import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../components/css/index.css";
import { Send } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import ChatMessage from './Chat';
import { expenseRoute, userRoute } from '../components/constant';
import { useSpring, animated } from '@react-spring/web';

const AnimatedNumber = ({ value }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { duration: 1000 },
  });

  return (
    <animated.span>
      {number.to((n) => n.toFixed(0))}
    </animated.span>
  );
};

const ChatSection = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [dummy, setDummy] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [newData, setNewData] = useState({});
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${userRoute}/get-details/${userId}`, { withCredentials: true });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${expenseRoute}/all-expenses/${userId}`, { withCredentials: true });
        setDummy(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchChats();
  }, [userId, newData]);

  useEffect(() => {
    setChats(dummy);
  }, [dummy]);

  const handleAddExpense = async () => {
    if (!amount || isNaN(amount) || !description) {
      alert("Please enter a valid amount and description.");
      return;
    }

    const newExpense = {
      amount: Number(amount),
      description: description,
    };

    try {
      setSendLoading(true);
      const response = await axios.post(`${expenseRoute}/create-expense/${userId}`, newExpense, { withCredentials: true });
      if (response.data.success) {
        setNewData(response.data.data);
        setAmount('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setError("Failed to add expense.");
    } finally {
      setSendLoading(false);
    }
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const isSmall = screenWidth < 840

  const [take, setTake] = useState(0);  // State for "take"
  const [give, setGive] = useState(0);
  useEffect(() => {
    const fetchtotal = () => {
      let takeTotal = 0;
      let giveTotal = 0;

      for (const chat of dummy) {
        const isOutgoing = chat.createdWith[0] === userId;
        const completeSettle = chat.status === "settled" || chat.confirmedByReciever;
        if (!completeSettle) {
          if (isOutgoing) {
            takeTotal += chat.splitAmount;
          } else {
            giveTotal += chat.splitAmount;
          }
        }
      }

      setTake(takeTotal); // Update the state for "take"
      setGive(giveTotal); // Update the state for "give"
    };

    fetchtotal(); // Call the function inside useEffect

  }, [dummy, userId]);
  return (
    <>
      <div className={`chat-section ml-4 pr-3 rounded-md w-full ${isSmall ? "" : ""} ${loading ? "flex justify-center items-center" : ""}`}>
        {loading ? (
          <ClipLoader />
        ) : (

          <div className={`flex flex-col justify-between h-fit ${isSmall ? "mt-1" : "mt-0"}`}>
            <div className={`h-8 p-5 ${isSmall ? "mt-0" : "mt-4"} py-8  flex items-center justify-between capitalize bg-slate-800 text-white w-full text-lg rounded-lg md:mr-80`}>
              <div className='mr-3 flex gap-3'>
                <img className='h-8 w-8 rounded-full' alt='profile' src='https://images.unsplash.com/photo-1719864413962-069ac5ca4bb8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                {data?.name}
              </div>

              <div className="flex gap-4 justify-center items-center">
                <div className="p-2 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-lg flex items-center">
                  <span className="text-sm font-medium">Give</span>
                  <span className="text-2xl ">₹<AnimatedNumber value={give} /></span>
                </div>
                <div className="p-2 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-lg flex items-center ">
                  <span className="text-sm font-medium">Take</span>
                  <span className="text-2xl ">₹<AnimatedNumber value={take} /></span>
                </div>
              </div>
            </div>

            <div className={`flex flex-col overflow-hidden pb-3`}>
              <div className={`flex flex-col-reverse overflow-y-auto max-h-[75vh] `}>
                {chats.length === 0 ? (
                  <h1 className='text-center pb-3'>No Gain No Pain</h1>
                ) : (
                  chats.map((chat, index) => (
                    <ChatMessage key={index} message={chat} splitwith={userId} />
                  ))
                )}
              </div>

              <div className={`bg-gray-200 h-16 w-full rounded-lg p-4 flex items-center justify-between  ${isSmall ? "mt-5" : ""}  `}>
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

          </div>

        )}
      </div>
    </>
  );
};

export default ChatSection;
