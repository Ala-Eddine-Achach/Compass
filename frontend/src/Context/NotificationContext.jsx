import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(false);

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const initialNotifCount = parseInt(localStorage.getItem("notifCount")) || 0;
    const [isVisible, setIsVisible] = useState(false);
    const [notifCount, setNotifCount] = useState(initialNotifCount);
    const toggleVisibility = () => {
        setIsVisible((prevVisible) => !prevVisible);
        //console.log(isVisible)
        localStorage.removeItem("notifCount");
        setNotifCount(0);
    };
    return (
        <NotificationContext.Provider value={{
            isVisible,
            setIsVisible,
            toggleVisibility,
            notifCount,
            setNotifCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
