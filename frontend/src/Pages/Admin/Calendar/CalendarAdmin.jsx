import { useParams } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import AdminCalendar from "../../../Components/Calendar/AdminCalendar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import '../../../Components/Calendar/styles.css';
import MidNavbar from "../../../Components/MidNavbar/MidNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { WindowSize } from "../../../Context/WindowContext.jsx";
import { CurrentUser } from "../../../Context/CurrentUserContext.jsx";
import axios from "axios";
import { baseURL, GROUP, SESSION, SESSIONS_BY_GROUP } from "../../../Api/Api";
import Cookie from 'cookie-universal';
import {Button} from "reactstrap";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import PopUp from "../../../Components/Common/PopUp/PopUp.jsx";
import {toast, ToastContainer} from "react-toastify";


export default function Calendar() { 
    const {id} = useParams();
    const context = useContext(WindowSize);
    const windowSize = context.windowSize;
    const userContext = useContext(CurrentUser);
    const role = userContext.currentUser? userContext.currentUser.role: "student";
    
    const cookie = Cookie();
    const token = cookie.get('academiqa');

    const [sessionsData, setSessionsData] = useState("");
    const [reload, setReload] = useState(false);
    
    const [year, setYear] = useState("");
    const [sector, setSector] = useState("");
    const [amphi, setAmphi]= useState("");
    const [group, setGroup]=useState("");
    const [sectors, setSectors] = useState([]);
    const levels = [ 2, 3,4,5] ;
    const amphis = [1,2,3,4];
    // extract the unique sectors from the groups:


    function transform(sector){
        switch(sector){
            case "Génie logiciel": return "GL";
            case "Réseaux Informatiques et Télécommunications": return "RT";
            case "Informatique Industrielle et Automatique": return "IIA";
            case "Instrumentation et Maintenance Industrielle": return "IMI";
            case "Biologie Industrielle": return "BIO";
            case "Chimie Industrielle": return "CH";
            case "Math Physique Informatique": return "MPI";
            case "Chimie et Biologie Appliquées": return "CBA";
        }
    }
    

    useEffect(() => {
    axios.get(`${baseURL}/${GROUP}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(
        (response) => {
            console.log(response.data);
            const groups = response.data;
            setSectors ([...new Set(groups.map(group => group.sector))]);
            console.log("sectors:", sectors);


        }).catch((err) => {
            console.log(err);
        });
    }, []);


    const navigate = useNavigate();


      
    //get the sessions by user groupID
    useEffect(() => {
        console.log("sector:", sector, ",year: ", year, ",group:", group);
        if (sector && year && group) {
            const yearString =  year == 1? "ère année": "ème année";
          axios.get(
              `${baseURL}/${SESSION}/${SESSIONS_BY_GROUP}/${sector}/${year}${yearString}/${group}`
              , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(
            (response) => {
              console.log(response.data);
                  response.data.forEach((session) => {
                      if (session.holidayName!=null) {
                            session.Subject = session.holidayName;
                      }
                      else {
                          session.Subject = session.name;
                      }
                
                if(!session.StartTime){
                  session.StartTime = session.date}
                  if(!session.EndTime){
                    session.EndTime = session.endTime}
              })
              setSessionsData(response.data);
              console.log("sessions:", sessionsData);
            }).catch((err) => {
              console.log(err);
            });
        }
      }, [sector, year, group, reload]);
      
    const [isHovered, setIsHovered] = useState(false);
    const [isHoveredHolidays, setIsHoveredHolidays] = useState(false);
    const [groupDone, setGroupDone] = useState(false);
    const [holidaysDone, setHolidaysDone] = useState(false);
    const [fileGroup, setFileGroup] = useState(null);
    const [fileHolidays, setFileHolidays] = useState(null);
    const [formData, setFormData] = useState({
        numberOfWeeks: 0,
        semesterStartDate: "",
        file: null,
    });
    const handleGroupFileCLick = () => {
        document.getElementById('csv-upload-session').click();
    }
    const handleHolidaysFileClick = ()=>{
        document.getElementById('csv-upload-holidays').click();
    }
    const handleGroupFileChange = (e) => {
        console.log(e.target)
        setFileGroup(e.target.files[0]);
        setGroupDone(true);
    }
    const handleHolidaysDataChange = (e) => {
        console.log(e.target.value)
        console.log(e.target.name)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleHolidaysFileChange = (e) => {
        console.log(e.target)
        setHolidaysDone(true);
        setFormData({
            ...formData,
            'file':e.target.files[0],
        });
    }
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    };
    const handleSessionsSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', fileGroup);
        axios.post('http://localhost:5000/session-type/CreateAll', formData, config).then(r => {
            console.log(r)
            setGroupDone(false);
            setFileGroup(null);
            toast.success("Timetable created successfully, please now generate the sessions");
            document.getElementById('csv-upload-session').value = null;
        }).catch(e => {
            console.log(e)
            setGroupDone(false);
            setFileGroup(null);
            toast.error("Failed to create timetable, please try again");
            document.getElementById('csv-upload-session').value = null;
        })
    }
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
    const handleSessionsAdd = (e) => {
        e.preventDefault();
        console.log(formData);
        axios.post('http://localhost:5000/session', formData, config).then(r => {
            console.log(r)
            setFormData({
                numberOfWeeks: 0,
                semesterStartDate: "",
                file: null,
            })
            toast.success("Sessions created successfully")
            setIsOpen(false);
            console.log("file:", formData.file)
            setHolidaysDone(false);
            document.getElementById('csv-upload-holidays').value = null;
        }).catch(e => {
            console.log(e)
            setHolidaysDone(false);
            toast.error("Failed to create sessions, please try again")
            document.getElementById('csv-upload-holidays').value = null;
        })

    };
    const [isOpen, setIsOpen] =useState(false);
    const addLink = () => {
        setIsOpen(true)
    }
    return(
    <div className="px-5" style={{ width: '100%'}}>
        <ToastContainer
            position="top-right"
            autoClose="4000"
            theme="colored"
        />
        <div className="pt-lg-0 pt-3" style={{ marginTop: '20px'}}>
            <div className={`my-notes d-flex mt-4 p-3 mb-3`}>
                <div className="notes-icon">
                    <FontAwesomeIcon icon={faCalendarDays} size="2x"/>                
                </div>
                <h1 className="fs-2 ms-2 fw-bold" style={{ marginBottom:"0" }}>Admin Calendar</h1>
            </div>


            <div className="d-flex justify-content-between align-items-center">
                <form
                    // onSubmit={handleSubmit}
                >
                    <div className="d-flex" style={{flexWrap: "wrap"}}
                    >
                        <select name="level" id="level" className="form-select"
                                onChange={(e) => {
                                    setSector(e.target.value);
                                    if(e.target.value=="Math Physique Informatique" || e.target.value=="Chimie et Biologie Appliquées"){
                                        setYear(1);
                                    }
                                }
                                }>
                            <option value="" hidden>Select sector</option>

                            {
                                sectors.map((sector) => {
                                    return <option value={sector} key={sector}
                                        // selected={sector==selectedGroup?.sector}
                                    >{transform(sector)}</option>;
                                })
                            }
                        </select>

                        {(transform(sector)!="MPI" && transform(sector)!="CBA") && (
                            <select name="level" id="level" className="form-select"
                                    onChange={(e) => {
                                        setAmphi("");
                                        setYear(e.target.value);

                                        // window.location.pathname = `/admin/calendar/${e.target.value}`;
                                    }
                                    }>
                                <option value="" hidden>Select Level</option>
                                {/*{
                        groups
                        .filter((l) => l.sector == sector && l.group==1)
                        .map((level) => {
                            return <option value={level.year}  key={level.year}
                            // selected={level.year==selectedGroup?.year}
                            >{level.year}</option>
                        }
                        )
                    }
*/}
                                {
                                    levels.map((level) => {
                                        return <option value={level} key={level}
                                            // selected={level==selectedGroup?.year}
                                        >{level}</option>;

                                    })}
                            </select>)}

                        {
                            (transform(sector) == "MPI" || sector=="CBA" )&& (
                                <select name="year" id="year" className="form-select" value={"1"} hidden>
                                    {
                                        amphis.map((level) => {
                                            return <option value={level} key={level}
                                                // selected={level==selectedGroup?.year}
                                            >{level}</option>;
                                        })
                                    }

                                </select>)
                        }

                        <select name="group" id="group" className="form-select"
                                onChange={(e) => {
                                    setGroup(e.target.value);
                                    console.log(
                                        "group:", group,
                                        ",sector:", sector,
                                        ",year: ", year,
                                        ",amphi:", amphi);
                                }
                                }>
                            <option value="" hidden>Select Group</option>
                            {/*
                    {
                        groups
                        .filter((l) => l.sector == sector && (l.year== 2 || l.amphi==1))
                        .map((level) => {
                            return <option value={level.group} key={level.group}
                            // selected={level.group==selectedGroup?.group}
                            >{level.group}</option>
                        }
                        )
                    } */}
                            {
                                amphis.map((level) => {
                                    return <option value={level} key={level}
                                        // selected={level==selectedGroup?.year}
                                    >{level}</option>;
                                })
                            }

                        </select>

                        {/* <button className="form-button" type="submit">
                    submit
                </button> */}
                    </div>
                </form>
                <div className="d-flex">
                    <div style={{height: "40px"}}
                         className=" pe-2 d-flex AddEtudiant justify-content-end multiple-teachers">
                        <Button
                            onClick={handleGroupFileCLick}
                            className="addbtn"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered && !groupDone && (<span style={{fontSize: '14px'}}>
                                        Please upload a CSV file
                                    </span>)}
                            {!isHovered && !groupDone && (<span> Import timetable data </span>)}
                            {groupDone && <span> {fileGroup.name} </span>}
                        </Button>
                        {groupDone && (
                            <div
                                className="transform transition-transform duration-300 hover:scale-110  d-flex align-items-center ms-1"
                                onClick={handleSessionsSubmit}>
                                <IoMdCheckmarkCircleOutline fill={"#692E5F"} size={30} className="cursor-pointer"/>
                            </div>
                        )}
                        <input
                            type="file"
                            name="file"
                            className="image-prompt"
                            style={{display: "none"}}
                            accept=".csv"
                            id="csv-upload-session"
                            onChange={handleGroupFileChange}
                        />
                    </div>
                    <div style={{height: "40px"}}  onClick={addLink}
                         className=" pe-2 d-flex AddEtudiant justify-content-end multiple-teachers">
                        <Button
                            className="addbtn2"
                        >
                            <span> Generate sessions </span>
                        </Button>
                    </div>
                </div>
            </div>
            <AdminCalendar role={role} sessions={sessionsData} sector={sector} year={year} group={group} reload={reload} setReload={setReload}/>
        </div>
        <MidNavbar/>
        <PopUp fromCourse={true}  width={`${screenWidth > 740 ? '35vw':'60vw'} `} isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="pt-3">
                <form onSubmit={handleSessionsAdd} className="link-form">
                    <label className="fs-5  ms-1 mb-1 "> Enter The number of weeks in the semester:</label>
                    <input name={"numberOfWeeks"} type={"number"} onChange={handleHolidaysDataChange}/>
                    <label  className="fs-5 mt-3 ms-1 mb-1 "> Enter The start of the semester:</label>
                    <input name={"semesterStartDate"} type={"date"} onChange={handleHolidaysDataChange}/>

                    <div className="d-flex mt-3 ms-1">
                        <div style={{height: "40px"}}
                             className=" pe-2 d-flex AddEtudiant justify-content-end multiple-teachers">
                            <Button
                                onClick={handleHolidaysFileClick}
                                className="addbtn"
                                onMouseEnter={() => setIsHoveredHolidays(true)}
                                onMouseLeave={() => setIsHoveredHolidays(false)}
                            >
                                {isHoveredHolidays && !holidaysDone && (<span style={{fontSize: '14px'}}>
                                        Please upload a CSV file
                                    </span>)}
                                {!isHoveredHolidays && !holidaysDone && (<span> Import holidays data </span>)}
                                {holidaysDone && <span> {formData?.file?.name} </span>}
                            </Button>
                            <input
                                type="file"
                                name="file"
                                className="image-prompt"
                                style={{display: "none"}}
                                accept=".csv"
                                id="csv-upload-holidays"
                                onChange={handleHolidaysFileChange}
                            />
                        </div>
                    </div>

                    <div className="end d-flex justify-content-center mt-4">
                        <button type="submit" className="me-1" style={{width: "50%"}}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </PopUp>
    </div>
    )
}