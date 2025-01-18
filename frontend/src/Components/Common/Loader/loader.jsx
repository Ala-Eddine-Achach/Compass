import React from 'react';
import './loader.css';
const Loader = () => {
    return (
        <div className=" space-x-2">
            <div className="space-y-2">
                <div className="animate-pulse rounded-5 div1" ></div>
                <div className="animate-pulse rounded-5 div2" ></div>
            </div>
        </div>


    );
};

export default Loader;