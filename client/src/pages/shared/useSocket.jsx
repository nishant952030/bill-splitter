import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { baseUrl } from '../../components/constant';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketIo = io(`${baseUrl}`,{withCredentials:true});
        setSocket(socketIo);

        socketIo.on("connect", () => {
            console.log("Connected to the server with id:", socketIo.id);
        });

        socketIo.on("disconnect", () => {
            console.log("Disconnected from server");
        });
        return () => {
            socketIo.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};


export const useSocket = () => {
    return useContext(SocketContext);
};
