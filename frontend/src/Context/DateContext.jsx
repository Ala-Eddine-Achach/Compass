import { createContext, useContext, useState, useEffect } from 'react';

const DateContext = createContext();

export const useDate = () => {
    return useContext(DateContext);
};

export const DateProvider = ({ children }) => {
    const[date, setDate] = useState();
    useEffect(() => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setDate(today.toLocaleDateString('en-US', options));
    }, []);

    return (
        <DateContext.Provider value={date}>
            {children}
        </DateContext.Provider>
    );
};
