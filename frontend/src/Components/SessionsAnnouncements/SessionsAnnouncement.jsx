import React, { useContext, useEffect, useState } from "react";
import "./SessionsAnnouncement.css";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import AnnouncementMessage from "./AnnouncementMessage";
import AnnouncementInput from "./AnnouncementInput";
import noAnnouncement from "../../assets/images/noAnnouncement.svg";
import axios from "axios";
import { baseURL } from "../../Api/Api.jsx";
import { useParams } from "react-router-dom";
import { CurrentUser } from "../../Context/CurrentUserContext.jsx";
import Cookie from "cookie-universal";

function SessionsAnnouncement({ role , course}) {
    // Define initial state for announcements
    const [announcementsForStudent, setAnnouncementsForStudent] = useState([]);
    const [announcementsForTeacher, setAnnouncementsForTeacher] = useState([]);
    const { id } = useParams();
    const { currentUser, user } = useContext(CurrentUser);
    const userToken = Cookie().get('academiqa');

    // Fetch announcements for students from the server
    useEffect(() => {
        axios.get(`${baseURL}/announcement/subject/${id}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })
            .then((res) => {
                setAnnouncementsForStudent(res.data);
            })
            .catch((err) => {
                console.error(`${err} - Failed to find announcements by subject`);
            });
    }, [id, userToken]);

    // Fetch announcements for teachers from the server
    useEffect(() => {
        if (user && role === "Teacher" && user.id) {
            axios.get(`${baseURL}/announcement/subject/${id}/teacher/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
                .then((res) => {
                    setAnnouncementsForTeacher(res.data);
                })
                .catch((err) => {
                    console.error(`${err} - Failed to find announcements by subject and teacher`);
                });
        }
    }, [id, user && user.id, user && role, userToken]);

    return (
        <div className="sessionsAnnouncement-box">
            <div className="sessionsAnnouncement-title font-IstokWebBold">
                Announcements
            </div>
            <div className="sessionsAnnouncement-content pt-0 position-relative">
                <Scrollbar
                    trackColor={"#DBDBDBFF"}
                    thumbColor={"#B5B5B5FF"}
                    maxHeight={"300px"}
                >
                    {role === "Student" && announcementsForStudent.length === 0 && (
                        <div className="no-announcement e-auto-fit-content position-absolute top-50 start-50 translate-middle">
                            <img src={noAnnouncement} alt="No Sessions" />
                        </div>
                    )}
                    {role === "Student" &&
                        announcementsForStudent.map((announcement, index) => (
                            <AnnouncementMessage key={index} Announcement={announcement} />
                        )).reverse()}
                    {role === "Teacher" && announcementsForTeacher.length === 0 && (
                        <div className="no-announcement e-auto-fit-content position-absolute top-50 start-50 translate-middle">
                            <img src={noAnnouncement} alt="No Sessions" />
                        </div>
                    )}
                    {role === "Teacher" &&
                        announcementsForTeacher.map((announcement, index) => (
                            <AnnouncementMessage key={index} Announcement={announcement} />
                        )).reverse()}
                </Scrollbar>
            </div>
            {role === "Teacher" && <AnnouncementInput course={course} user={user} setAnnouncementsForTeacher={setAnnouncementsForTeacher}/>}
        </div>
    );
}

export default SessionsAnnouncement;
