
import React, {useEffect, useRef, useState} from 'react';
import './AddButton.css';
import PopUp from "../PopUp/PopUp.jsx";
const AddButton = ({ onFileSelect, onLinkAdd }) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] =useState(false);
    const [link,setLink]= useState('');
    const addLink = () => {
        setIsOpen(true)
    }


    const handleFileSelect = () => {
        inputRef.current.click();
    };

    const handleInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
        } else {
            // Handle case where user clicks "Add File" but doesn't select a file
            //console.log("No file selected");
        }
    };

    const handleLinkAdd = (e) => {
        e.preventDefault();
        if (link !== '') {
            onLinkAdd(link);
            setIsOpen(false)
            setLink('');
        }
    };
    const handleCancel = () => {
        setLink('');
    };

    return (
        <div className="dropdown-container">
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />
            <button
                title="Add New"
                className="group cursor-pointer outline-none hover:rotate-90 duration-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35px"
                    height="35px"
                    viewBox="0 0 24 24"
                    className="stroke-zinc-800 fill-none group-active:stroke-zinc-400  group-active:duration-0 duration-300"
                >
                    <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        strokeWidth="1.5"
                    ></path>
                    <path d="M8 12H16" strokeWidth="1.5"></path>
                    <path d="M12 16V8" strokeWidth="1.5"></path>
                </svg>
            </button>

                <div className="dropdown-content w-16 rounded-2xl ">
                    <button className="d-flex align-items-center justify-content-center" onClick={handleFileSelect}> File </button>
                    <button className="d-flex align-items-center justify-content-center" onClick={addLink}> Link </button>
                </div>

            <PopUp width={`${screenWidth > 740 ? '35vw':'60vw'} `} isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="pt-3">
                    <p className="fs-5 fw-bold ms-1 mb-1 "> Enter The link:</p>
                    <form onSubmit={handleLinkAdd} onReset={handleCancel} className="link-form">
                        <input onChange={(e)=> setLink(e.target.value)} value={link}  />
                        <div className="end d-flex justify-content-between mt-4">
                            <button type="submit" className="me-1">
                                Submit
                            </button>
                            <button type="reset" className="ms-1">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </PopUp>

        </div>
    );
};

export default AddButton;
