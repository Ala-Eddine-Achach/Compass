import avatar from "../../assets/images/avatar.png";
import {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import MidNavbar from "../MidNavbar/MidNavbar";
import "../Navbar/Navbar.css";
import EmptyNavbar from "./EmptyNavbar";
import SmallCalendar from "../Calendar/SmallCalendar";
import {CurrentUser} from "../../Context/CurrentUserContext.jsx";
import Cookie from 'cookie-universal';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { baseURL, SESSION, SESSIONS_BY_TEACHER, SESSIONS_BY_GROUP } from "../../Api/Api";




const Navbar = () => {
  const {currentUser, user} = useContext(CurrentUser);
  const [sessionsData, setSessionsData] = useState("");

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const nav = useNavigate();
  const cookie = Cookie();
  const token = cookie.get('academiqa');


  // get sessions for small calendar 
  useEffect(() => {  
  // for a teacher
  if (jwtDecode(token).role.toLowerCase() === 'teacher') {
    axios.get(`${baseURL}/${SESSION}/${SESSIONS_BY_TEACHER}/${jwtDecode(token).id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  }).then(
      (response) => {
          //console.log("sessions by teacher", response.data);
          response.data.forEach(
            (session) => {
              if (session.holidayName!=null) {
                session.Subject = session.holidayName
              }
              else {
                session.Subject = session.name;
              }
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
  // for a student
  if (jwtDecode(token).role.toLowerCase() === 'student') {
    if (user) {
      //console.log("user:", user);
      axios.get(
          `${baseURL}/${SESSION}/${SESSIONS_BY_GROUP}/${user?.group?.sector}/${user?.group?.level}/${user?.group?.group}`
          , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(
        (response) => {
          //console.log("sessions:",response.data);
          response.data.forEach((session) => {
            session.Subject = session.name;
            if(!session.StartTime){
              session.StartTime = session.date}
              if(!session.EndTime){
                session.EndTime = session.endTime}
          })
          setSessionsData(response.data);
        }).catch((err) => {
          console.log(err);
        });
    }
  }
  


  }
  , []);


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 760);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isSmallScreen ? (
        <MidNavbar>
          <Link to={`${currentUser?.role}/calendar`} className="CalendarbuttonNav">
            <svg viewBox="0 0 22 22" className="calendarNav">
              <path d="M19 3H17V1H15V3H9V1H7V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM17 12H13V8H17V12Z"></path>
            </svg>
          </Link>
        </MidNavbar>
      ) : (
        <>
          <EmptyNavbar width={'22rem'}>
            <div className="profileNav">
              <img src={user?.photo || avatar } alt="teacher" className="profilephoto"/>
              <div className="accountName">{user?.username}</div>
              <Link to={`/${currentUser?.role}/profile`} className="nameButton">
                My Profile
              </Link>
            </div>
            <div title='go to calendar' className="calendar mt-3" onClick={() => nav(`/${currentUser?.role}/calendar`)}>
              <SmallCalendar sessions={sessionsData} role={currentUser?.role} />
            </div>
            <div className="calendardiv">
              <Link to={`/${currentUser?.role}/calendar`} className="calendarButton">
                My Calendar
              </Link>
            </div>
          </EmptyNavbar>
        </>
      )}
    </>
  );
};

export default Navbar;