import Navbar from "../../../Components/Navbar/Navbar.jsx";
import React, { useContext, useEffect, useState } from "react";
import "./HomeStudent.css";
import SeeMoreButton from "../../../Components/Common/SeeMoreButton/SeeMoreButton.jsx";
import axios from "axios";
import Course from "../../../Components/Course/Course.jsx";
import { Menu } from "../../../Context/MenuContext.jsx";
import { useDate } from "../../../Context/DateContext.jsx";
import { NoteContext } from "../../../Context/NoteContext.jsx";
import Note from "../../../Components/Note/Note.jsx";
import {CurrentUser} from "../../../Context/CurrentUserContext.jsx";
import Cookie from "cookie-universal";
import {baseURL, SECTORLEVEL, SUBJECT} from "../../../Api/Api.jsx";

export default function HomeStudent() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const {currentUser,user} = useContext(CurrentUser);
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
  const { notes } = useContext(NoteContext);
  const [courses, setCourses] = useState([]);
  const colors = [
    "#F7E2E0",
    "#E8F5F7",
    "#F6E8D6",
    "#D8ECD6",
    "#E1E2F0",
    "#F3F6E0",
  ];
  const NoteColors = [
    "192, 222, 189", // green
    "198, 206, 235", // blue
    "230, 235, 198", // light yellow
    "179, 159, 209", // purple
    "228, 235, 188", // light green
    "237, 203, 199", // light pink
    "247, 226, 224", // pink
    "246, 232, 214", // light orange
  ];

  useEffect(() => {
    if(currentUser?.role === "Student"){
      const userToken = Cookie().get('academiqa');
      axios
          .get(`${baseURL}/${SUBJECT}/${SECTORLEVEL}/${user?.group?.sectorLevel}`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setCourses(res.data.slice(0, 3));
          })
          .catch((err) => {
            console.error(`${err} - Failed to find courses`);
          });
    }
  }, [user, currentUser]);

  return (
    <div className="d-flex justify-content-between  student-home-page m-0 pe-0">
      <div className="body mt-8 px-4 flex-grow-1">
        {screenWidth >= 1060 ? (
          <div className="px-3 d-flex justify-content-between">
            <div className={`p-0`}>
              <div className="Welcoming d-flex flex-column p-3">
                <h5 className="fs-5 ms-2 fw-bold">Welcome back, {user?.username}!</h5>
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
                screenWidth <= 600 && screenWidth > 520 ? "mt-5" : ""
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
              <SeeMoreButton role={"student"} path={"courses"} />
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
          <div className="some-notes mb-3">
            <div className="header d-flex justify-content-between">
              <h5 className="fs-5 fw-bold">My notes</h5>
              <SeeMoreButton role={"student"} path={"notes"} />
            </div>
            <div className="container">
              <div className="row d-flex justify-content-center">
                {notes &&
                  notes.slice(0, 3).map((note, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`col-lg-4 col-md-6 col-sm-12 course-${index} mt-2 p-0 d-flex flex-column justify-content-center align-items-center`}
                      >
                        <Note
                          maxWidth={true}
                          note={note}
                          baseColor={NoteColors[index % NoteColors.length]}
                        />
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}