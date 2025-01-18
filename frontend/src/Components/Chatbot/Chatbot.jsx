import { useEffect, useState } from 'react';
import PopUp from "../Common/PopUp/PopUp";
import OldDiscussions from "./OldDiscussions.jsx";
import ChatbotDiscussion from "./ChatbotDiscussion.jsx";
import './Chatbot.css';
import chatbotChatbot from "../../assets/images/chatbot-chatbot.svg";
import axios from "axios";
import Cookie from "cookie-universal";

const Chatbot = ({isOpen, setIsOpen}) => {
    const [discussions, setDiscussions] = useState([]);
    const [discussionId, setDiscussionId] = useState(null);
    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 906);

    //get all discussions from the server
    const getDiscussions = async () => {
        try{
            const cookie = Cookie();
            const userToken = cookie.get('academiqa')
            const res = await axios.get('http://localhost:5000/chatbot',{
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setDiscussions(res.data);
            if(res.data.length > 0){
                setDiscussionId(res.data[res?.data.length-1]?.id)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        getDiscussions();
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMediumScreen(window.innerWidth < 906);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <PopUp width={"77vw"} isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="mx-2">
                <div className="container d-flex flex-column justify-content-center align-items-center ">
                    <div
                        className={`Welcome row mb-4 p-0 d-flex justify-content-center align-items-center rounded-5`}>
                        <div className="title row p-0 col-10 d-flex flex-column justify-content-end align-items-center">
                            <h1 className={`p-0 pe-2 fw-bold text-center`}> Welcome to AcademIQa Bot </h1>
                            {!isMediumScreen ? (<span
                                className="d-flex flex-column mt-1 justify-content-end align-items-end fw-semibold"> Gemini-Pro</span>) : null}
                        </div>

                        {!isMediumScreen ? (<div className="col-2 p-0">
                            <img
                                src={chatbotChatbot}
                                alt="Chatbot"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>) : null}

                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-md-2 ps-0 pe-1 mb-1">
                            <OldDiscussions discussions={discussions} onDiscussionSelect={setDiscussionId} getDiscussions={getDiscussions}/>
                        </div>
                        <div className="col-lg-10 col-md-10 pe-0 ps-1 mb-1">
                            <ChatbotDiscussion
                                discussion={discussions.find(item => item.id === discussionId) || null}
                                getDiscussions={getDiscussions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopUp>
    );
};

export default Chatbot;
