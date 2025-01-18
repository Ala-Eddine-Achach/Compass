import React, { useRef, useState } from 'react';
import axios from 'axios';
import "./AnnouncementInput.css";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { baseURL } from "../../Api/Api.jsx";
import Cookie from "cookie-universal";

function AnnouncementInput({course,user, setAnnouncementsForTeacher}) {
    const inputRef = useRef(null);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const userToken = Cookie().get('academiqa');

    const handleInputChange = (event) => {
        setNewAnnouncement(event.target.value);
    };

    // Function to add a new announcement
    const addAnnouncement = () => {
        if (newAnnouncement.trim() !== "") {
            // Send a POST request to the backend to create the announcement
            axios.post(`${baseURL}/announcement`, { content: newAnnouncement, subject:course ,teacher:user }, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
                .then((res) => {
                    // Handle the response here, if needed
                    //console.log("Announcement created:", res.data);
                    setAnnouncementsForTeacher((prevState) => [...prevState, res.data]);
                    // Clear the input field
                    setNewAnnouncement('');
                })
                .catch((err) => {
                    console.error(`${err} - Failed to create announcement`);
                });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents default form submission behavior
        addAnnouncement(); // Call the addAnnouncement function to create the announcement
        inputRef.current.value = ""; // Clear the input field
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event); // Call handleSubmit when Enter is pressed
        }
    };

    return (
        <>
            <form className="announcement-form container mb-1.5" onSubmit={handleSubmit}>
                <div className="col-10 send-input-announcement mb-1 ">
                    <textarea
                        className=" pt-3"
                        ref={inputRef}
                        rows="1"
                        placeholder={"Type an announcement ..."}
                        value={newAnnouncement} // Bind the value of textarea to newAnnouncement state
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <button type="submit" className="send-icon-button w-7 ">
                    <PiPaperPlaneTiltBold size={23} />
                </button>
            </form>
        </>
    );
}

export default AnnouncementInput;
