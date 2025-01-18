import React, {useContext, useEffect, useRef, useState} from 'react';
import Scrollbar from "../Common/Scrollbar/Scrollbar.jsx";
import MessageInput from "../Common/MessageInput/MessageInput.jsx";
import Message from "./Message/Message.jsx";
import './CommonSessionChat.css';
import EmptyNavbar from "../Navbar/EmptyNavbar.jsx";
import {useSocket} from "../../Context/SocketContext.jsx";
import {CurrentUser} from "../../Context/CurrentUserContext.jsx";

const Chat = ({session}) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const [value, setValue] = useState("");
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    // const [joined, setJoined] = useState(false);
    const {currentUser, user} = useContext(CurrentUser);
    const [typing, setTyping] = useState('');
    const messagesEndRef = useRef(null);
    const [nbNestedReplies, setNbNestedReplies] = useState(0);
    // join effect
    useEffect(() => {
        const join = () => {
            socket?.emit('join', {
                sessionId: session?.id,
                user: currentUser,
            });
        };
        join();
    }, [socket,session]);
    // userJoined effect
    useEffect(() => {
        const handleUserJoined = (user) => {
            //console.log("userJoined", user)
        };

        socket?.on('userJoined', handleUserJoined);

        return () => {
            socket?.off('userJoined', handleUserJoined);
        };
    }, [socket]);


    let timeout;
    const emitTyping = () => {
        socket?.emit('typing', {isTyping: true, sessionId: session?.id});
        timeout = setTimeout(() => {
            socket?.emit('typing', {isTyping: false, sessionId: session?.id});
        },2000);
    }
    // typing effect
    useEffect(() => {
        const handleTyping = (data) => {
            if (data.isTyping) {
                //console.log("rim data", data)
                if(data?.sender?.id !== currentUser?.id){
                    setTyping(data?.sender?.username);
                }
            } else {
                setTyping('');
            }
        };

        socket?.on('typing', handleTyping);

        return () => {
            socket?.off('typing', handleTyping);
        };
    }, [socket]);
    const send = (message) => {
        socket?.emit('message', message, (response) => {
            if (response.error) {
                console.error('Error sending message:', response.error);
            }
        });
    };
    const deleteMsg = (id)=>{
        //console.log("hello", session)
        socket?.emit('deleteMessage', {id, session});
    }

    const getAllMessages = (session) => {
        socket?.emit('messages',session, (messages) => {
            setMessages(messages);
        });
    };
    // getAllMessages effect
    useEffect(() => {
        getAllMessages(session);
    }, [socket, session]);
    // handleAllMessages effect
    useEffect(() => {
        const handleAllMessages = (messages, receivedSession) => {
            if (receivedSession?.id === session?.id) {
                setMessages(messages);
            }
        };

        socket?.on('allMessages', handleAllMessages);

        return () => {
            socket?.off('allMessages', handleAllMessages);
        };
    }, [socket, session]);
    // handleReply effect
    useEffect(() => {
        const messageListener = (data) => {
            // Check if the incoming message's session matches the current session
            if (data?.session?.id === session?.id) {
                //console.log("data", data);

                setMessages((prevMessages) => {
                    const handleReply = (messages) => {
                        return messages.map((message) => {
                            if (message?.id === data?.parent?.id) {
                                return {
                                    ...message,
                                    replies: [...(message?.replies || []), data],
                                };
                            }

                            if (message?.replies) {
                                return {
                                    ...message,
                                    replies: handleReply(message?.replies),
                                };
                            }

                            return message;
                        });
                    };
                    if (data.parent) {
                        return handleReply(prevMessages);
                    } else {
                        return [...prevMessages, data];
                    }
                });

                // Scroll to the bottom (assuming this is defined elsewhere)
                scrollToBottom();
            }
        };
        // Attach the messageListener to the socket
        socket?.on('message', messageListener);

        // Clean up the event listener on component unmount
        return () => {
            socket?.off('message', messageListener);
        };
    }, [session, socket]);


    const handleDeletedMessage = (id) => {
        const removeMessageAndReplies = (messages) => {
            return messages
                .filter((msg) => msg.id !== id) // Remove the message with the given ID
                .map((msg) => {
                    if (msg.replies && msg.replies.length > 0) {
                        // Recursively remove the message and its replies
                        return {
                            ...msg,
                            replies: removeMessageAndReplies(msg.replies)
                        };
                    }
                    return msg;
                });
        };

        setMessages((prevMessages) => removeMessageAndReplies(prevMessages));
    };
    // delete effect
    useEffect(()=> {
        socket?.on('deletedMessage', handleDeletedMessage);
        return () => {
            socket?.off('deletedMessage', handleDeletedMessage);
        }
    },[handleDeletedMessage])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim() !== "") {
            send({ content:value, author: user, session:session });
            setValue("");
        }
    }

    const handleValueChange = (e) => {
        emitTyping();
        setValue(e.target.value);
    }

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView();
    };

    return (
        <EmptyNavbar width={'27rem'}>
            <div className="common-chat d-flex flex-column align-items-center justify-content-between">
                <div className="d-flex flex-column align-items-center">
                    <h1 className="text-center fw-bold">
                        Questions & Answers
                    </h1>
                    <hr className="mt-2" style={{width: "70%"}}/>
                </div>


                <Scrollbar thumbColor={"#692E5F"} trackColor={"#F0EDF2"} maxHeight={`${screenWidth >992 ? '65vh':'100vh'}`}>
                    <div className="messages" >
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                deleteMsg={deleteMsg}
                                message={message}
                                send={send}
                                emitTyping={emitTyping}
                                nbNestedReplies={nbNestedReplies}
                                pickerUnderInput={index === 0 || index === 1}
                                session={session}
                            />
                        ))}

                        <div ref={messagesEndRef}></div>
                    </div>
                </Scrollbar>


                <div className="container">
                    <div >
                        {typing && (
                        <div className="typing d-flex px-4 mt-2">
                            <div className="typing d-flex align-items-center">
                                {typing} is typing
                            </div>
                            <div className="typing-indicator">
                                <div className="typing-circle"></div>
                                <div className="typing-circle"></div>
                                <div className="typing-circle"></div>
                                <div className="typing-shadow"></div>
                                <div className="typing-shadow"></div>
                                <div className="typing-shadow"></div>
                            </div>
                        </div>
                        )}
                    </div>
                    <hr className="mb-3 mt-2"/>
                    <MessageInput
                        handleSubmit={handleSubmit}
                        handlePromptChange={handleValueChange}
                        prompt={value}
                        setPrompt={setValue}
                        fromChatBot={false}
                    />
                </div>
            </div>
        </EmptyNavbar>
    );
};

export default Chat;