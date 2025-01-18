import React, { createContext } from 'react';
import {toast, ToastContainer} from 'react-toastify';

// Create a context
const ToastContext = createContext();

// Toast provider component
const ToastProvider = ({ children }) => {
    const showToast = (message,type) => {
        console.log("toastify");
        console.log(type);
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            case 'info':
                toast.info(message);
                break;
            default:
                toast(message);
        }
    }

    return (
        <ToastContext.Provider value={{showToast}}>
            <ToastContainer theme="colored" />
            {children}
        </ToastContext.Provider>
    );
};

export { ToastProvider, ToastContext };
