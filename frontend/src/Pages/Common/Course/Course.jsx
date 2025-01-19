import React, {useContext, useEffect, useState} from "react";
import CourseName from "../../../Components/SessionsAnnouncements/CourseName.jsx";
import SessionsAnnouncement from "../../../Components/SessionsAnnouncements/SessionsAnnouncement.jsx";
import SessionsList from "../../../Components/SessionsList/SessionsList.jsx";
import MidNavbar from "../../../Components/MidNavbar/MidNavbar.jsx";
import "./Course.css";
import {useDate} from "../../../Context/DateContext.jsx";
import {useLocation, useParams} from "react-router-dom";
import {CurrentUser} from "../../../Context/CurrentUserContext.jsx";
import axios from "axios";
import Cookie from "cookie-universal";

const Course = () => {
    const date = useDate();
    const {id} = useParams();
    const [course, setCourse] = useState();
    const [sessions, setSessions] = useState([]); // You can use this state to store the sessions of the course
    const {currentUser, user} = useContext(CurrentUser);
    const userToken = Cookie().get('compass');
    useEffect(() => {
        //console.log("Sessionssssssssssssss: ", course?.sessionTypes);
        if (course?.sessionTypes) {
            let filteredSessionTypes = course?.sessionTypes;
            //console.log("filteredSessionTypes: ", filteredSessionTypes);

            if (currentUser?.role === 'Student') {
                filteredSessionTypes = course?.sessionTypes.filter(
                    sessionType => {
                        if (sessionType?.type === 'Lecture') {
                            return sessionType?.group?.sectorLevel === user?.group?.sectorLevel;
                        } else {
                            return sessionType?.group?.id === user?.group?.id;
                        }
                    }
                );
            }

            const allSessions = filteredSessionTypes?.map(sessionType => {
                return sessionType?.sessions?.map((session, index) => {
                    return {
                        ...session,
                        rank: index + 1,
                        group: sessionType?.group?.group,
                        teacherId: sessionType?.teacherId
                    };
                });
            }).flat();

            // Format session dates and sort them by date
            allSessions.forEach(session => {
                if(session?.date){
                    session.date = new Date(session?.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            });
            allSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Update the state with the filtered and sorted sessions
            setSessions(allSessions);
        }
    }, [course,currentUser?.role, currentUser?.group?.id]);

    useEffect(() => {
        axios.get(
            `http://localhost:5000/subject/${id}`,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(res => {
            setCourse(res.data);
            //console.log("Course: ", res.data);
        }).catch(err => {
            console.error(`${err} - Failed to find session`);
        })
    }, [currentUser?.role, currentUser?.group?.id]);

    if (!currentUser) {
        return <div>Loading...</div>; // Render a loading state while currentUser is awaited
    }
    //console.log(currentUser.role);
    return (
        <div className="course-page container-fluid pt-6">
            <div className="row date pl-10 mb-12">
                {date}
            </div>
            <MidNavbar/>
            <div className="row">
                <div className="col-sm-9 pl-10 course-name -mt-5">
                    <CourseName course={course}/>

                    <div className="box-announcement">
                        <SessionsAnnouncement course={course} role={currentUser.role}/>
                    </div>
                </div>
                <div className="col-sm-3 pr-2.5 my-3 box-sessions d-flex justify-end">
                        <SessionsList sessions={sessions}/>
                </div>
            </div>
        </div>
    );
};

export default Course;