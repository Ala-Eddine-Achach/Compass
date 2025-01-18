import {BiSolidMessageSquareAdd} from "react-icons/bi";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import React, {useEffect, useState} from "react";
import Discussion from "../../assets/images/old-discussion.svg";
import DeleteButton from "../Common/DeleteButtonForResTask/DeleteButton.jsx";
import axios from "axios";
import Cookie from "cookie-universal";

// eslint-disable-next-line react/prop-types
const OldDiscussions = ({onDiscussionSelect, discussions,getDiscussions}) => {

    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMediumScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleDiscussionClick = (id) => {
        if (onDiscussionSelect) {
            onDiscussionSelect(id);
        }
    }
    const createNewDiscussion = () => {
        if (onDiscussionSelect) {
            onDiscussionSelect(null);
        }
    }
    const cookie = Cookie();
    const userToken = cookie.get('academiqa')
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

     const handleDelete = async (index) =>{
        try {
            //console.log("index",index)
           await axios.delete(`http://localhost:5000/chatbot/${index}`,config);
            getDiscussions();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div className={`${isMediumScreen ? 'small' : 'large'} historique p-1 pt-2`}>
            <div
                className="mt-2 d-flex justify-content-center align-items-lg-center align-items-md-center  cursor-pointer flex-lg-row  flex-md-column  "
                onClick={createNewDiscussion}
            >
                <div>
                    <BiSolidMessageSquareAdd size={20}/>
                </div>
                <p className="fw-bold ps-1 mt-1 fs-5 text-sm-center">New discussion</p>
            </div>
            <p className="mt-4 fw-bold text-center">
                Recent discussions
            </p>

            <div className="container px-1 old-ones d-flex justify-content-md-start justify-content-center">
                <Scrollbar thumbColor={"#692E5F"} trackColor={"#D1C4D8"} maxHeight={`${isMediumScreen ? '65px' : '200px'}`}>
                        {discussions?.map((discussion, index) => (
                            <div key={index} className="to-delete d-flex justify-content-between">
                                <div  className="old-discussion m-1 mt-2 d-flex justify-content-start"
                                     onClick={() => handleDiscussionClick(discussion.id)}>
                                    <img src={Discussion} alt={"discussion"} width={15} height={15}/>
                                    <p className="mb-0 ms-1">
                                        {/* each discussion contains objects */}
                                        {discussion.messages[0].prompt}
                                    </p>

                                </div>
                                <div className="file-delete-button container max-w-4 "
                                    onClick={() => handleDelete(discussion.id)}
                                >
                                    <DeleteButton/>
                                </div>
                            </div>

                        )).reverse()}
                </Scrollbar>
            </div>
        </div>

    );
};

export default OldDiscussions;