import Chat from "../../../Components/CommonSessionChat/Chat.jsx";
import './Session.css';
import {FaBookOpenReader} from "react-icons/fa6";
import React, {useEffect, useRef, useState} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useDate} from "../../../Context/DateContext.jsx";
import Ressources from "../../../Components/Ressources/Ressources.jsx";
import Task from "../../../Components/Task/Task.jsx";
import PresenceSheet from "../../../Components/PresenceSheet/PresenceSheet.jsx";
import {useLocation, useParams} from "react-router-dom";
import Cookie from "cookie-universal";
import axios from "axios";
import {lastDateOfMonth} from "@syncfusion/ej2-react-schedule";

export default function SessionTeacher() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [session, setSession] = useState();
    const {id} = useParams();
    const userToken = Cookie().get('academiqa');
    useEffect(() => {
        axios
            .get(`http://localhost:5000/session/${id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                setSession(res.data);
                // console.log("Session from session: ", res.data);
            })
            .catch((err) => {
                console.error(`${err} - Failed to find session`);
            });
    }, []);
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

    const date = useDate();
    return (
        <div className="d-flex teacher-session-page">
            <div className="session-content flex-grow-1 mt-4 ps-4 pe-4">
                {screenWidth >= 1030 ? (<div className="d-flex justify-content-between">
                        <div className="the-course  ms-3 p-2 px-3">
                            <div className="d-flex">
                                <div className="courses-icon">
                                    <FaBookOpenReader size={30}/>
                                </div>
                                <h1 className="ms-2 fs-3 fw-bold">{session?.sessionType?.type} n°{session?.rank}</h1>
                            </div>
                            <h1 className="ms-2 mt-1 fs-4 fw-bold">{session?.name}</h1>
                        </div>
                        <div className="ms-3 mt-2 d-flex flex-column justify-content-start">
                            <div className="date mb-2">
                                Date: {session?.sessionType?.day}, {new Date(session?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>) :
                    (<div className="">
                        <div className="ms-4 d-flex flex-column justify-content-center">
                            <div className="date mb-2">
                                Date: {session?.sessionType?.day}, {new Date(session?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div className="the-course  ms-3 p-2 ">
                            <div className="d-flex">
                                <div className="courses-icon">
                                    <FaBookOpenReader size={30}/>
                                </div>
                                <h1 className="ms-2 fs-3 fw-bold">{session?.sessionType?.type} n°{session?.rank}</h1>
                            </div>
                            <h1 className="ms-2 mt-1 fs-4 fw-bold">{session?.name}</h1>
                        </div>
                    </div>)
                }
                <div className="row mt-5 mb-2">
                    <div className="presence-sheet col-md-6 mb-3">
                        <PresenceSheet sessionId={id} session={session}/>
                    </div>
                    <div className="ressources-tasks col-md-6 d-flex flex-column align-items-center ">
                        <div
                            className="row d-flex justify-content-center p-sm-0 mb-1 mb-md-3 tasks w-full" >
                            <Task role={'teacher'} session={session}/>
                        </div>
                        <div
                            className="row px-lg-3 p-sm-0 mt-sm-3 mt-lg-0 ressources ">
                            <Ressources role={"teacher"} sessionId={id}/>
                        </div>
                    </div>
                </div>
            </div>
            <Chat session={session}/>

        </div>
    )
}