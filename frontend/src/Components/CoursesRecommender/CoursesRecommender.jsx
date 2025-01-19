import {useEffect, useState} from 'react';
import axios from "axios";
import { FaLink } from "react-icons/fa6";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import PopUp from "../Common/PopUp/PopUp";
import './CoursesRecommender.css';
import {PiPaperPlaneTiltBold} from "react-icons/pi";
import {FaStar} from "react-icons/fa";
import chatbotRecommend from "../../assets/images/chatbotRecommend.svg";
// Modal.setAppElement(document.getElementById('__next'));

const CoursesRecommender = ({isOpen, setIsOpen}) => {
    const [course, setCourse] = useState('')
    const [courses, setCourses] = useState([])
    const [numRec, setNumRec] = useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log('Course: ', course)
        const data = {course: course, recNum: numRec}
        try {
            const res = await axios.post('http://127.0.0.1:5001/recommend', data);
            setCourses(Object.values(res.data).map(course => course));
            //console.log('Response:', res.data);
            //console.log('Courses:', courses);
            // setCourse('')
            // setNumRec(0)

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [isMediumScreen, setIsMediumScreen] = useState(false); // Adjust breakpoint as needed

    useEffect(() => {
        const handleResize = () => setIsMediumScreen(window.innerWidth < 993);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [isSmallScreen, setIsSmallScreen] = useState(false); // Adjust breakpoint as needed

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <PopUp width={!isMediumScreen ? "45vw": "65vw"} isOpen={isOpen} setIsOpen={setIsOpen}>
            <div
                className="container d-flex flex-column justify-content-center align-items-center"
            >
                <div
                    className={`Recommend-title mb-2 p-2 row d-flex ${isMediumScreen ? 'flex-column ' : ''} justify-content-center align-items-center rounded-5`}>
                    {!isSmallScreen && <div className="col-2 p-0">
                        <img
                            src={chatbotRecommend}
                            alt="Chatbot"
                            style={{width: '100%', height: 'auto'}}
                        />
                    </div>}
                    <h1 className={` m-0 font-bold text-center ${isMediumScreen ? 'medium-h1 col ' : 'col-10'}`}> Recommend
                        Courses </h1>
                </div>
                <div className="container">
                    <div className="row">
                        <form onSubmit={handleSubmit} className="recommend-form">
                            <div className="row mb-2 mt-2">
                                <div className="col-lg-7 course-input mb-1 p-0 d-flex justify-content-center">
                                    <input
                                        style={{color: 'black'}}
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                        placeholder={"Type course ..."}
                                    />
                                </div>
                                <div
                                    className="col-lg-4 col-md-7 col-sm-7 number-input d-flex ps-0 pe-0 ps-md-0 ps-lg-1 ps-sm-0 pe-md-1 justify-content-center ">
                                    <input
                                        id="number-input"
                                        type="number"
                                        placeholder={"Number of rec ..."}
                                        value={numRec === 0 ? '' : numRec}
                                        onChange={(e) => setNumRec(e.target.value)}
                                        min={1}
                                        max={100}
                                        step={1}
                                    />
                                </div>
                                <div className="col-lg-1 col-md-3 col-sm-3 ps-1 pe-1 d-flex justify-content-center">
                                    <button type="submit" >
                                        <div className={"SendIcon"}>
                                            <div className={"sendIconButton"}>
                                                <PiPaperPlaneTiltBold size={24}/>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </form>
                        {courses.length > 0 && <div className="courses pt-0 pb-2">

                            <Scrollbar trackColor={'#f0edf2'} thumbColor={'#692E5F'}
                                       maxHeight={`${isMediumScreen ? '295px' : '338px'}`}>
                                {courses.map((courseRec, index) => (
                                    <div key={index}
                                         className={`course ${index === 0 ? '' : 'mt-3'} ms-1 me-2 pt-1 pb-1 pe-2 ps-2`}>
                                        <div className="course-title mb-1 d-flex">
                                            <FaLink size={20}/>

                                            <a className="ms-1" href={`${courseRec.URL}`} target="_blank">
                                                <strong>{courseRec.Title}</strong></a>
                                        </div>
                                        <div className="ms-3">
                                            Platform: {courseRec.Site} <br/>

                                            {courseRec.course_Rating !== 'Nothing' && (
                                                <div className="d-flex">
                                                    Rating: {courseRec.course_Rating}
                                                    <div className="star-icon ms-2 d-flex align-items-center ">
                                                        <FaStar size={20}/>
                                                    </div>

                                                    <br/>
                                                </div>
                                            )}
                                            {courseRec.course_Duration !== 'Nothing' && (
                                                <>
                                                    Duration: {courseRec.course_Duration}
                                                    <br/>
                                                </>
                                            )}
                                        </div>

                                        <div className="payment-status d-flex justify-content-end">
                                            {courseRec.Payment_Status !== 'nothing' && (
                                                <>
                                                    <strong>{courseRec.Payment_Status}</strong>
                                                    <br/>
                                                </>
                                            )}
                                        </div>

                                    </div>))}
                            </Scrollbar>

                            {/*Python for Beginners: Python Programming Language | Tutorial*/}
                        </div>}

                    </div>
                </div>
            </div>
        </PopUp>
    );
};

export default CoursesRecommender;