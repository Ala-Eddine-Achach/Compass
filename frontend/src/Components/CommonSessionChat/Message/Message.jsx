import {BsReplyFill} from "react-icons/bs";
import {AiOutlineMessage} from "react-icons/ai";
import {useContext, useState} from "react";
import MessageInput from "../../Common/MessageInput/MessageInput.jsx";
import './Message.css'
import avatar from "../../../assets/images/avatar.png";
import DeleteButton from "../../Common/DeleteButton/DeleteButton.jsx";
import {CurrentUser} from "../../../Context/CurrentUserContext.jsx";


// eslint-disable-next-line react/prop-types
const Message = ({deleteMsg, message, send,emitTyping,nbNestedReplies, pickerUnderInput, session}) => {
    const {user, currentUser} = useContext(CurrentUser);
    const [viewReplies, setViewReplies] = useState(false);
    const [viewReplyForm, setViewReplyForm] = useState(false);
    const [value, setValue] = useState("");
    const dateOptions = {month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const date = new Date(message?.createdAt);
    const dateString = `${date.toLocaleDateString('en-US', dateOptions)}, ${date.toLocaleTimeString('en-US', timeOptions)}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value !== "") {
            //console.log("message sent", message)
            const newMessage = {content:value, parent:message, author:user,session:session};
            //console.log("new message", newMessage)
            send(newMessage);
            //console.log("message sent", message);
            setValue("");
            setViewReplies(true);
            setViewReplyForm(false);
        }
    }
    const deleteMessage = () => {
        //console.log("message deleted", message?.id)
        deleteMsg(message?.id);

    }

    const handleValueChange = (e) => {
        emitTyping();
        setValue(e.target.value);
    }

    const handleViewReplies = () => {
        setViewReplies(!viewReplies);
    }
    const handleViewReplyForm = () => {
        setViewReplyForm(!viewReplyForm);
    }
    return (
        <div className="message pb-0 pt-4 px-3 me-1 d-flex flex-column">
            <div className="d-flex">
                <img
                    className="rounded-circle img "
                    src={message?.author?.photo || avatar }
                    alt="sender"
                />
                <div className="sender-message">
                    <div className="message-sender ms-3 mb-1">
                        {message?.author?.id === currentUser?.id ? "You": message?.author?.username}
                    </div>
                    <div className="d-flex ">
                        <div
                            className={`message-content rounded-4 px-3 pt-1 pb-1 ms-2 ${message?.author?.role === "Student" ? 'light' : 'dark'}`}
                            title={dateString}

                        >
                            {message?.content}
                        </div>
                        {currentUser?.id === message?.author?.id && (
                            <div className="delete-msg" onClick={deleteMessage}>
                            <DeleteButton/>
                        </div>
                        )}
                    </div>

                </div>
            </div>
            <div className="under-msg">
                <div className="reply-view d-flex align-items-center mt-1">
                    {message?.replies?.length > 0 && (
                        <div className="view-button d-flex align-items-center me-4" onClick={handleViewReplies}>
                            <div className={`view-replies me-1 ms-2 ${viewReplies ? '' : 'active'}`}
                                 style={{transform: 'rotate(190deg)', color: `${viewReplies ? '' : '#717171'}`}}>
                                <BsReplyFill size={25}/>
                            </div>
                            <span style={{color: `${viewReplies ? '' : '#717171'}`}}>
                                {viewReplies ? `Hide replies` : `View replies`}
                            </span>
                        </div>)}

                    {nbNestedReplies < 3 &&(<div className="reply-button d-flex align-items-center" onClick={handleViewReplyForm}>
                        <div className={`reply me-1 mb-1 ${viewReplyForm ? '' : 'active'}`}>
                            <AiOutlineMessage size={20}/>
                        </div>
                        <span style={{color: `${viewReplyForm ? '' : '#717171'}`}}>Reply</span>
                    </div>)}

                </div>
                {message?.replies?.length > 0 && (
                    <div>
                        {viewReplies &&
                            message.replies.map((reply, index) => (
                                <Message
                                    key={index}
                                    message={reply}
                                    emitTyping={emitTyping}
                                    send={send}
                                    nbNestedReplies={nbNestedReplies + 1}
                                    deleteMsg={deleteMsg}
                                    session={session}
                                />
                            ))}
                    </div>

                )}
                <div className="reply-input">
                    {viewReplyForm && nbNestedReplies < 3 && (
                        <MessageInput
                            handleSubmit={handleSubmit}
                            handlePromptChange={handleValueChange}
                            prompt={value}
                            setPrompt={setValue}
                            fromChatBot={false}
                            pickerUnderInput={pickerUnderInput}
                        />
                    )}
                </div>
            </div>
            </div>
    );
};

export default Message;