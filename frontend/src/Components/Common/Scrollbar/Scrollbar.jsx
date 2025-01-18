import React from 'react';
import './Scrollbar.css';

function Scrollbar({ children, trackColor, thumbColor, maxHeight }) {
    const scrollbarStyle = {
        '--track-color': trackColor,
        '--thumb-color': thumbColor,
        '--max-height': maxHeight,
    };

    return (
        <div className="scroll-container mt-3 pb-1" style={scrollbarStyle}>
            {children}
        </div>
    );
}

export default Scrollbar;