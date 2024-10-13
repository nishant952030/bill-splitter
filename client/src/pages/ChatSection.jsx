import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatSection = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/get-details/${userId}`, { withCredentials: true });
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError('Failed to fetch user details');
        }
      } catch (err) {
        setError('Error fetching user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className='pt-20 ml-4   rounded-md w-full'>
      <div className='h-8 p-5 py-8 flex items-center capitalize bg-slate-800 text-white w-full text-lg rounded-l-xl md:mr-80'>{data?.name}</div>
      <div className=''>
        
      </div>
      <div>{userId}</div>
    </div>
  );
};

export default ChatSection;
