import "./CourseName.css";
import { FaBookOpenReader } from "react-icons/fa6";
import teacherphoto from "../../assets/images/teacher-photo.svg";
import {useContext} from "react";
import {CurrentUser} from "../../Context/CurrentUserContext.jsx";

function CourseName({course}) {
    const {currentUser} = useContext(CurrentUser);
  return (
    <div className="course-name-box">
      <div>
        <FaBookOpenReader className="course-icon" />
      </div>
        <div className="course-info font-IstokWebBold">
            <div className="course-name-title font-IstokWebBold overflow-hidden"
                 title= {course?.name}
            >
                {course?.name}
            </div>
            <div className="course-additional-info font-IstokWebBold">
                {course?.sectorLevel}
                {course?.teachersUsernames && course.teachersUsernames?.map((teacherInfo, index) => (
                    <div className="prof course-additional-info" key={index}>
                        {teacherInfo.username} - {teacherInfo.types.join(", ")}
                        <br/>
                    </div>
                ))}
            </div>

        </div>
        {/*{ currentUser?.role === "Student" &&*/}
        {/*<div className="course-teacher-photo">*/}
        {/*    <img src={teacherphoto} alt="teacher" />*/}
        {/*</div>*/}
        {/*}*/}
    </div>
  );
}

export default CourseName;
