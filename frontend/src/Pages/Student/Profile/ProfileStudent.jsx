import './ProfileStudent.css';
import React, {useContext, useEffect, useState} from "react";
import {useDate} from "../../../Context/DateContext.jsx";
import MiniNavbar from "../../../Components/MiniNavbar/MiniNavbar.jsx";
import absence from "../../../assets/images/attendance.png";
import Profile from "../../../Components/Profile/Profile.jsx";
import Course from "../../../Components/Course/Course.jsx";
import axios from "axios";
import NoAbsence from "../../../assets/images/NoAbsence.svg"
import {FaBookOpenReader} from "react-icons/fa6";
import Cookie from "cookie-universal";
import {CurrentUser} from "../../../Context/CurrentUserContext.jsx";
import {baseURL, SUBJECT, SECTORLEVEL, STUDENTSABSENCE, PRESENCE} from '../../../Api/Api.jsx';
export default function ProfileStudent() {
    const date = useDate();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 860);
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 860);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const colors = ['#F7E2E0', '#E8F5F7', '#F6E8D6', '#D8ECD6', '#E1E2F0', '#F3F6E0'];
    const [courses, setCourses] = useState([]);
    const {currentUser,user} = useContext(CurrentUser);
    useEffect(() => {
        if(currentUser?.role === "Student"){
            const userToken = Cookie().get('academiqa');
            axios
                .get(`${baseURL}/${PRESENCE}/${STUDENTSABSENCE}/${currentUser?.id}`,{
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then((res) => {
                    setCourses(res.data);
                    setCourses(res.data.filter((course) => course.numberOfAbsence > 0));
                })
                .catch((err) => {
                    console.error(`${err} - Failed to find courses`);
                });
        }
    }, [user, currentUser]);
        const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    return (
        <div className="container profile-student-page pt-3 pe-4">
            <MiniNavbar/>
            <div className={`date ms-3 ${screenWidth < 410 ? 'mt-5':''}`}>
                {date}
            </div>
            <div className="container " style={{marginTop:'38px'}}>
                <div className={`row d-flex justify-content-sm-center justify-content-md-start ${isSmallScreen ? 'more-margin' : ''}`}>
                    <div className="col-xl-4 col-lg-5 col-md-6 profile d-flex justify-content-sm-center justify-content-md-start">
                        <Profile />
                    </div>
                    {courses.length > 0 ?(
                                <div
                                    className="absence d-flex flex-column align-items-sm-center align-items-md-start col-xl-8 col-lg-7 col-md-6 row p-1 pt-3 mb-3 rounded-2xl">
                                        <div className="my-courses d-flex  mt-1 p-3 ms-3 mb-2" style={{height:'fit-content'}}>
                                            <div className="courses-icon d-flex align-items-center">
                                                <img src={absence} alt={"absence"} style={{width: "25px", height: "auto"}}/>
                                            </div>
                                            <h1 className="ms-2 fw-bold">My absences</h1>
                                        </div>
                                        <div className="row">
                                            {courses.map((course, index) => (
                                                <div key={index} style={{height: 'fit-content'}}
                                                     className="col-xl-4 col-lg-6 col-md-12 col-sm-6 d-flex mb-2 mt-2 flex-column justify-content-center align-items-center">
                                                    <Course course={course} color={colors[index % colors.length]}
                                                            placement="absence"/>
                                                </div>
                                            ))}
                                        </div>

                                </div>
                            ) :
                        (

                            <>
                                <div
                                    className="absence col-xl-8 col-lg-7 col-md-6 d-flex flex-column  mb-3 rounded-2xl">
                                    <div className="my-courses d-flex mt-1 p-3 ms-3 mb-4" style={{height:'fit-content'}}>
                                        <div className="courses-icon d-flex align-items-center">
                                            <img src={absence} alt={"absence"} style={{width:"25px",height:"auto"}}/>
                                        </div>
                                        <h1 className="ms-2 fw-bold">My absences</h1>
                                    </div>

                                    <div className="d-flex justify-content-center" style={{height:'70%'}}>
                                        <img src={NoAbsence} alt={"NoAbsence"} className="no-absence"
                                             style={{width: '17%', height: 'auto', opacity: '0.7'}}/>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>


        </div>)
}