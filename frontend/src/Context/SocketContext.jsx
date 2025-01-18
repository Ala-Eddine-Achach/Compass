import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();

    useEffect(() => {
        const socket = io('http://localhost:8001');
        setSocket(socket);

        return () => {
            socket.disconnect(); // Disconnect the socket when the component unmounts
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
