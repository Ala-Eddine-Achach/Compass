import { useEffect, createContext, useState } from "react";

export const WindowSize = createContext(null);

export default function WindowContext({ children }) {
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    useEffect(() => {
        function setWindowWidth() {
            setWindowSize(window.innerWidth);
        }
        // add event listener to window for resize event and call setWindowWidth function when it happens
        window.addEventListener('resize', setWindowWidth);

        // clean up function
        return () => {
            window.removeEventListener('resize', setWindowSize);
        }
    }
        , [])

    return <WindowSize.Provider value={{ windowSize, setWindowSize }}>
        {children}
    </WindowSize.Provider>
}
