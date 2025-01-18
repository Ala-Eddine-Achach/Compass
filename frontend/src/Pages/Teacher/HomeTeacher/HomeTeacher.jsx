import Navbar from "../../../Components/Navbar/Navbar.jsx";
import React, {useContext, useEffect, useRef, useState} from "react";
import "./HomeTeacher.css";
import SeeMoreButton from "../../../Components/Common/SeeMoreButton/SeeMoreButton.jsx";
import axios from "axios";
import Task from "../../../Components/Task/Task.jsx";
import Cookie from "cookie-universal";
import Course from "../../../Components/Course/Course.jsx";
import { Menu } from "../../../Context/MenuContext.jsx";
import { useDate } from "../../../Context/DateContext.jsx";
import { NavLink } from "react-router-dom";
import { CurrentUser } from "../../../Context/CurrentUserContext.jsx";
import { baseURL, TEACHER, SUBJECT  } from "../../../Api/Api";
import Slider from "react-slick";
import Note from "../../../Components/Note/Note.jsx";
import NoNotes from "../../../assets/images/NoNotes.svg";
import StudentsList from "../../../Components/StudentsList/StudentsList.jsx";

export default function HomeTeacher() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { currentUser, user } = useContext(CurrentUser);
    const userToken = Cookie().get('academiqa');
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const date = useDate();
  const [courses, setCourses] = useState([]);
  const colors = [
    "#F7E2E0",
    "#E8F5F7",
    "#F6E8D6",
    "#D8ECD6",
    "#E1E2F0",
    "#F3F6E0",
  ];


    const sliderRef = useRef(null);
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false,
                },
            },
        ],
    };
    const [studentsList, setStudentsList ] = useState([]);
    useEffect(() => {
        axios
            .get(`${baseURL}/student/group/teacher`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                setStudentsList(res.data);
            })
            .catch((err) => {
                console.error(`${err} - Failed to fetch students list`);
            });
    }, []);
    //console.log("Students List: ", studentsList)
    useEffect(() => {
        if(currentUser?.role === "Teacher"){

            axios
                .get(`${baseURL}/${SUBJECT}/${TEACHER}`,{
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then((res) => {
                    setCourses(res.data.slice(0, 3));
                    //console.log("Courses: ", res.data)
                })
                .catch((err) => {
                    console.error(`${err} - Failed to find courses`);
                });
        }
    }, [user, currentUser]);

  return (
    <div className="d-flex justify-content-between  teacher-home-page m-0 pe-0">
      <div className="body mt-8 px-4 flex-grow-1">
        {screenWidth >= 1060 ? (
          <div className="px-3 d-flex justify-content-between">
            <div className={`p-0`}>
              <div className="Welcoming d-flex flex-column p-3">
                <h5 className="fs-5 ms-2 fw-bold">
                  Welcome back, {user?.username}!
                </h5>
                <p className="fs-6 ms-2">
                  Hope you're ready for another awesome day with us!
                </p>
              </div>
            </div>
            <div className="date text-end">{date}</div>
          </div>
        ) : (
          <div
            className={`px-3`}
            style={{ marginTop: screenWidth <= 520 ? "60px" : "" }}
          >
            <div className="date text-start mb-1 ps-2">{date}</div>
            <div
              className={`p-0 ${
                screenWidth <= 760 && screenWidth > 520 ? "mt-5" : ""
              }`}
            >
              <div className="Welcoming d-flex flex-column p-3">
                <h5 className="fs-5 ms-2 fw-bold">Welcome back, Rym!</h5>
                <p className="fs-6 ms-2">
                  Hope you're ready for another awesome day with us!
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="content">
          <div className="some-courses mt-4">
            <div className="header mt-9 mb-3 d-flex justify-content-between">
              <h5 className="fs-5 fw-bold">My Courses</h5>
              <SeeMoreButton role={"teacher"} path={"courses"} />
            </div>
            <div className="container">
              <div className="row d-flex justify-content-center">
                {courses.map((course, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`col-lg-4 col-md-6 col-sm-12 course-${index} mt-2 mb-4 p-0 d-flex flex-column justify-content-center align-items-center`}
                    >
                      <Course
                        maxWidth={true}
                        course={course}
                        color={colors[index % colors.length]}
                        placement="course"
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <hr className="mt-2 mb-4" />
            <div className="groups mb-3">
                <div className="header d-flex justify-content-between">
                    <h5 className="fs-5 fw-bold">My Student Groups</h5>
                </div>
                <div className="slider mt-2 d-flex justify-content-center">
                    {studentsList && studentsList.length > 3 ? (
                        <Slider ref={sliderRef} {...settings}>
                            {studentsList.map((group, index) => (
                                <div key={index} className="">
                                    <StudentsList group={group}/>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        studentsList.map((group, index) => (
                            <React.Fragment key={index}>
                                <div
                                    className={`col-lg-4 col-md-6 col-sm-12 course-${index} mt-2  p-0 d-flex flex-column justify-content-center align-items-center note-container`}
                                >
                                    <StudentsList group={group} />
                                </div>
                            </React.Fragment>
                        ))
                    )}
                    {studentsList.length === 0 && (
                        <div className="no-notes d-flex mt-5 justify-content-center align-items-center">
                            <img
                                src={NoNotes}
                                alt={"NoNotes"}
                                className="no-notes"
                                style={{width: "100px", height: "auto"}}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
        <Navbar/>
    </div>
  );
}
