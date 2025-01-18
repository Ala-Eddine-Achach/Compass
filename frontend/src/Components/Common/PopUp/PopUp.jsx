import React, {useState} from 'react';
import Modal from "react-modal";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import './popup.css'
import Scrollbar from "../Scrollbar/Scrollbar.jsx";
Modal.setAppElement('body');
// eslint-disable-next-line react/prop-types
const PopUp = ({children, width, isOpen, setIsOpen, backgroundColor = "#FFFEFC",fromCourse,fromPresence}) => {
    function closeModal() {
            setIsOpen(false);
    }
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            padding: fromPresence? '0':"1.5rem",
            paddingBottom: fromPresence? '0':"1.5rem",
            paddingTop: fromCourse ? '0' : '1.5rem',
            transform: "translate(-50%, -50%)",
            backgroundColor: backgroundColor,
            color: "white",
            border: "none",
            borderRadius: "3.2em",
            width: width,
            // maxHeight: "94vh",
        }, overlay: {
            zIndex: "1000",
            backgroundColor: "rgba(15, 19, 30, 0.65)",
        },
    };
    return (
        <div className="hello container">

                <Modal
                    // ariaHideApp={false}
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    style={customStyles}>
                    <IconContext.Provider
                        value={{ color: "#262626", className: "close-modal" }}
                    >
                        <div onClick={closeModal}>
                            <IoCloseCircleOutline />
                        </div>
                    </IconContext.Provider>
                    {!fromPresence ? (
                        <Scrollbar thumbColor={"#692E5F"} trackColor={"#D1C4D8"} maxHeight={"81vh"}>
                            {children}
                        </Scrollbar>
                    ) : (
                        <>
                            {children}
                        </>
                    )}
                </Modal>

        </div>
    );
};

export default PopUp;