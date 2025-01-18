import React, {useContext, useEffect, useState} from 'react';
import './PresenceSheet.css';
import Scrollbar from "../Common/Scrollbar/Scrollbar.jsx";
import {MdOutlineMoreVert} from "react-icons/md";
import {NavLink} from "react-router-dom";
import PopUp from "../Common/PopUp/PopUp.jsx";
import {PiStudent} from "react-icons/pi";
import avatar from "../../assets/images/avatar2.png";
import WebcamCapture from "../FaceRecognition/WebcamCapture.jsx";
import axios from "axios";
import Cookie from "cookie-universal";
import {ToastContext} from "../../Context/ToastContext.jsx";

const PresenceSheet = ({sessionId, session}) => {
    const cookie = Cookie();
    const userToken = cookie.get('academiqa')
    useEffect(() => {
         axios.get(`http://localhost:5000/session/presentStudents/${sessionId}`,{
             headers: {
                 Authorization: `Bearer ${userToken}`,
             },
         }).then(
            (res) => {
                setStudents(res.data);
            }
        ).catch((err) => {
            console.error(`${err} - Failed to find students`);
        }
        )

        axios.get(`http://localhost:5000/session/absentStudents/${sessionId}`,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(
            (res) => {
                setAbsentStudents(res.data);
                console.log("Absent Students : ", allStudents)
            }
        ).catch((err) => {
                console.error(`${err} - Failed to find students`);
            }
        )
    }, [sessionId]);
    const [students, setStudents] = useState([]);
    const [absentStudents, setAbsentStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [display, setDisplay] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isManOpen, setIsManOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const {showToast} = useContext(ToastContext);
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
    const openCamera = () => {
        setDisplay(!display);
        setIsOpen(true);
    }
    const takeAttendance = () => {
        setDisplay(!display);
        setIsManOpen(true);
    }
    useEffect(() => {
        //i want to merge the two arrays and add for each student a boolean value to check if he is present or not
        let all = absentStudents.map(student => {
            return {
                ...student,
                isPresent: false
            }
        })
        students.map(student => {
            all.push({
                ...student,
                isPresent: true
            })
        })
        setAllStudents(all);
    }, [students, absentStudents]);
    const markPresent = async (student) => {
        const data = {
            session: {id: sessionId},
            student: {id: student.id}
        }
        if(student.isPresent){
            console.log( "Student marked present", student.isPresent)
            await axios.delete(`http://localhost:5000/presence`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
                data: data
            }).then(
                (res) => {
                    setStudents(students.filter(s => s.id !== student.id));
                    setAbsentStudents([...absentStudents, {...student, isPresent: false}]);
                    console.log("Student marked absent", student)
                }
            ).catch((err) => {
                console.error(`${err} - Failed to mark student absent`);
            })
    } else {
            await axios.post(`http://localhost:5000/presence`,data,{
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            }).then(
                (res) => {
                    setAbsentStudents(absentStudents.filter(s => s.id !== student.id));
                    setStudents([...students, {...student, isPresent: true}]);
                    console.log("Student marked present")
                }
            ).catch((err) => {
                console.error(`${err} - Failed to mark student present`);
            })
        }
        const index = allStudents.findIndex(s => s.id === student.id);
        // let newStudents = [...allStudents];
        // newStudents[index].isPresent = !newStudents[index].isPresent;
        // console.log("New students", newStudents)
        // setAllStudents(newStudents);
    }
    const finishSession = async () => {
        showToast("Session finished", 'success');
        const data = {
            session: {
                id: sessionId,
                name: session.name,
            },
            absentStudents: absentStudents
        }
        console.log("Data to send", data)
        await axios.post(`http://localhost:5000/session/finish`,data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(
            (res) => {
                console.log("Session finished")
            }
        ).catch((err) => {
            console.error(`${err} - Failed to finish session`);
        })
    }

    return (
        <div className="d-flex justify-content-between flex-column presence-sheet-box h-[535px] shadow position-relative p-3">
            <div>
                <div className="p-s-title h-10 font-IstokWebRegular font-bold ml-3.5  text-2xl ">
                    Presence Sheet
                </div>
                <div className="p-s-content h-fit pt-3 mx-4">
                    <Scrollbar
                        trackColor="#DBDBDBFF"
                        thumbColor="#B5B5B5FF"
                        maxHeight="380px"
                    >
                        {students.map((student, index) => (
                            <div key={index} className="p-s-student flex pl-1.5 pr-2.5">
                                <span className="p-s-student-name font-IstokWebRegular">{student.username}</span>
                            </div>
                        ))}
                    </Scrollbar>
                </div>
            </div>
            <div className="d-flex justify-content-evenly items-center h-10 ">
                <button
                    className="session-buttons d-flex justify-content-between align-items-center ps-3 p-2 p-s-btn rounded-2xl h-11 max-w-48 w-full my-3">
                    <span className="font-bold take-attendance">Take attendance</span>
                    <div className="see-more cursor-pointer ">
                        <MdOutlineMoreVert fill={'white'} size={30} onClick={() => setDisplay(!display)}/>
                        {display && (<div className="dropdown-course-content">
                                <div onClick={takeAttendance}
                                     className="dropdown-course-item d-flex align-items-center justify-content-center">
                                    Manually
                                </div>
                                <div
                                    onClick={openCamera}
                                    className="dropdown-course-item d-flex align-items-center justify-content-center">
                                    With camera
                                </div>
                            </div>
                        )}

                        <PopUp fromPresence={true}
                               fromCourse={true}
                               width={`${screenWidth > 900 ? '90vw' : screenWidth > 600 ? '80vw' : '90vw'} `}
                               isOpen={isOpen} setIsOpen={setIsOpen}>
                            <WebcamCapture sessionId={sessionId} students={students} setStudents={setStudents}
                                           setAbsentStudents={setAbsentStudents} absentStudents={absentStudents}
                                           allStudents={allStudents} setAllStudents={setAllStudents}/>
                        </PopUp>

                        <PopUp fromCourse={true}
                               width={`${screenWidth > 900 ? '30vw' : screenWidth > 600 ? '45vw' : '60vw'} `}
                               isOpen={isManOpen} setIsOpen={setIsManOpen}>
                            <div className="d-flex align-items-center mb-1 ms-1">
                                <PiStudent size={30}/>
                                <p className="fs-5 fw-bold ms-2 mt-1"> List of Students:</p>
                            </div>
                            <div className="student-list d-flex justify-content-center">
                                <Scrollbar thumbColor={"#692E5F"} trackColor={"#F0EDF2"} maxHeight={'69vh'}>
                                    {allStudents?.map((student, index) => (
                                        <div key={index}
                                             className="student-item d-flex align-items-center justify-content-between ms-2 "
                                             style={{width: "90%"}}>
                                            <p className="fs-6 px-3">{student?.username}</p>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <label
                                                    className="containerCheck"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={student.isPresent}
                                                        onChange={() => markPresent(student)}
                                                    />
                                                    <svg viewBox="0 0 64 64" height="1.2em" width="1.2em">
                                                        <path
                                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                            pathLength="575.0541381835938"
                                                            className="pathCheck"
                                                        ></path>
                                                    </svg>
                                                </label>
                                            </div>

                                        </div>
                                    ))}

                                </Scrollbar>
                            </div>
                        </PopUp>


                    </div>
                </button>
                <button onClick={finishSession}
                    className="session-buttons d-flex justify-content-between align-items-center  p-3 p-s-btn rounded-2xl h-11 max-w-48 my-3">
                    <span className="font-bold">Finish Session</span>

                </button>
            </div>
        </div>
    );
};

export default PresenceSheet;