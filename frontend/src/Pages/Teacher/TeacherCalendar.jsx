import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import MidNavbar from "../../Components/MidNavbar/MidNavbar.jsx";
import AdminCalendar from "../../Components/Calendar/AdminCalendar.jsx";
import axios from "axios";
import {baseURL, RIM, SESSION, SESSION_TYPE, SESSIONS_BY_GROUP, SESSIONS_BY_TEACHER} from "../../Api/Api";
import Cookie from 'cookie-universal';
import { jwtDecode } from "jwt-decode";
import {useContext, useEffect, useState} from "react";
import {CurrentUser} from "../../Context/CurrentUserContext.jsx";

export default function TeacherCalendar() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(-1);
    const [sessionsData, setSessionsData] = useState([]);
    const {currentUser,user} = useContext(CurrentUser);
    const cookie = Cookie();
    const token = cookie.get('academiqa');
    // get groups of teacher
    useEffect(() => {
        try {
            axios.get(`${baseURL}/${SESSION_TYPE}/GroupsByTeacher/${jwtDecode(token).id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(
                (response) => {
                    //console.log("groups:", response.data);
                    setGroups(response.data);
                }).catch((err) => {
                    console.log(err);
                }
            );
        } catch (e) {
            console.log(e);
        }
    }, [currentUser]);

    //get the sessions by groupID
    useEffect(
        () => {
            if (selectedGroupId && selectedGroupId != -1) {
                const selectedGroup = groups.find((group) => group.id == selectedGroupId);
                axios.get(`${baseURL}/${SESSION}/${SESSIONS_BY_GROUP}/${selectedGroup.sector}/${selectedGroup.level}/${selectedGroup.group}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(
                    (response) => {
                        //console.log("selected group", selectedGroup);
                        response.data.forEach(
                            (session) => {
                                session.Subject = session.name;
                            }
                        )
                        setSessionsData(response.data);
                        //console.log("sessions:", response.data);

                    }).catch((err) => {
                        console.log(err);
                    }
                );
            }
            if (selectedGroupId == -1) {
                axios.get(`${baseURL}/${SESSION}/${SESSIONS_BY_TEACHER}/${jwtDecode(token).id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(
                    (response) => {
                        //console.log("sessions by teacher", response.data);
                        response.data.forEach(
                            (session) => {
                                session.Subject = session.name;
                                session.StartTime = session.date;
                                session.EndTime = session.endTime;
                                session.group = session.sessionType.group.sectorLevel;
                            }
                        )
                        setSessionsData(response.data);
                    }).catch((err) => {
                        console.log(err);
                    }
                );
            }
        }
        , [selectedGroupId]
    )


    return(
        <div className="px-5" style={{ width: '100%'}}>
        <div className="pt-lg-0 pt-3" style={{marginTop: '20px'}}>
            <div className={`my-notes d-flex mt-4 p-3 mb-3`}>
                <div className="notes-icon">
                <FontAwesomeIcon icon={faCalendarDays} size="2x"/>                
                </div>
                <h1 className="fs-2 ms-2 fw-bold" style={{marginBottom:"0" }}>Teacher Calendar</h1>
            </div>            <select name="level" id="level" className="form-select"
             onChange={(e) => {
                setSelectedGroupId(e.target.value);
            }
            }>
                <option value="-1">My Calendar </option>
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.sectorLevel}</option>))}
            </select>
        <AdminCalendar role="teacher" sessions={sessionsData}/>
        </div>
    <MidNavbar role={"teacher"}/>
    </div>
    )
}