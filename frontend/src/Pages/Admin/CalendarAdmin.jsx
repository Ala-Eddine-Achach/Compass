// import { useParams } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import AdminCalendar from "../../Components/Calendar/AdminCalendar";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
// import '../../Components/Calendar/styles.css';
// import MidNavbar from "../../Components/MidNavbar/MidNavbar.jsx";
// import { useNavigate } from "react-router-dom";
// import { WindowSize } from "../../Context/WindowContext.jsx";
// import { CurrentUser } from "../../Context/CurrentUserContext.jsx";
// import axios from "axios";
// import { baseURL, GROUP, SESSION, SESSIONS_BY_GROUP } from "../../Api/Api";
// import Cookie from 'cookie-universal';
// import { jwtDecode } from "jwt-decode";


// export default function Calendar() {
//     const {id} = useParams();
//     const context = useContext(WindowSize);
//     const windowSize = context.windowSize;
//     const userContext = useContext(CurrentUser);
//     const [reload, setReload] = useState(false);
//     const cookie = Cookie();
//     const token = cookie.get('academiqa');
//     const role = jwtDecode(token).role;
//     const [sessionsData, setSessionsData] = useState("");
    
//     const [year, setYear] = useState("");
//     const [sectorSelected, setSectorSelected] = useState("");
//     const [amphi, setAmphi]= useState("");
//     const [group, setGroup]=useState("");
//     const [sectors, setSectors] = useState([]);
//     const levels = [ 2, 3,4,5] ;
//     const amphis = [1,2,3,4];

//     // get all groups
//     useEffect(() => {
//     axios.get(`${baseURL}/${GROUP}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     }).then(
//         (response) => {
//             console.log(response.data);
//             const groups = response.data;
//             setSectors ([...new Set(groups.map(group => group.sector))]);
//             console.log("sectors:", sectors);
//         }).catch((err) => {
//             console.log(err);
//         });
//     }, []);

      
//     //get the sessions by user groupID
//     useEffect(() => {
//         if (sectorSelected && year && group) {
//           axios.get(
//               `${baseURL}/${SESSION}/${SESSIONS_BY_GROUP}/${sector}/${year}ème année/${group}`
//               , {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }).then(
//             (response) => {
//               console.log(response.data);
//               response.data.forEach((session) => {
//                 if (session.holidayName !=null) {
//                   session.Subject = session.holidayName
//                 }
//                 else {
//                 session.Subject = session.name;
//                 }
//                 if(!session.StartTime){
//                   session.StartTime = session.date}
//                   if(!session.EndTime){
//                     session.EndTime = session.endTime}
//               })
//               response.data.filter(
//                 (session) => {
//                   return session.deletedAt == null;
//                 }
//               )
//               setSessionsData(response.data);
//             }).catch((err) => {
//               console.log(err);
//             });
//         }
//       }, [sectorSelected, year, group, reload]);
      
    

//     return(
//     <div className="px-5" style={{ width: '100%'}}>
//         <div className="pt-lg-0 pt-3" style={{ marginTop: '20px'}}>
//             <div className={`my-notes d-flex mt-4 p-3 mb-3`}>
//                 <div className="notes-icon">
//                     <FontAwesomeIcon icon={faCalendarDays} size="2x"/>                
//                 </div>
//                 <h1 className="fs-2 ms-2 fw-bold" style={{ marginBottom:"0" }}>Admin Calendar</h1>
//             </div>
//             <form>
//                 <div className="d-flex" style={{flexWrap:"wrap", marginLeft:"10%"}}
//                 >
//                 <select name="level" id="level" className="form-select"
//                     onChange={(e) => {
//                         setSectorSelected(e.target.value);
//                     }}>
//                     <option value="" hidden>Select sector </option>
//                     {sectors.map((sector) => {
//                             return <option value={sector} key={sector}>{sector}</option>;
//                         })
//                     }
//                 </select>

//                 { sectorSelected!="MPI" &&( 
//                 <select name="level" id="level" className="form-select"
//                 onChange={(e) => {
//                     setAmphi("");
//                     setYear(e.target.value);

//                 }
//                 }>
//                      <option value="" hidden>Select Level </option>
//                     {
//                         levels.map((level) => {
//                             return <option value={level} key={level}>{level}</option>;
                          
//                     })}
//                 </select>)} 

//                 {
//                     sectorSelected == "MPI" &&(
//                         <select name="amphi" id="amphi" className="form-select"
//                 onChange={(e) => {
//                     setYear("1");
//                     setAmphi(e.target.value);

//                 }
//                 }>
//                      <option value="" hidden>Select Amphi </option>
//                     {
//                         amphis.map((level) => {
//                             return <option value={level} key={level}>{level}</option>;
//                         })
//                     }

//                 </select>)
//                 }

//                 <select name="group" id="group" className="form-select"
//                 onChange={(e) => {
//                     setGroup(e.target.value);
//                     console.log(
//                         "year:", year,
//                         ",sector:", sectorSelected,
//                         ",year: ", year,
//                         ",group:", e.target.value
//                     );
//                 }
//                 }>
//                      <option value="" hidden>Select Group </option>
//                     {
//                         amphis.map((level) => {
//                             return <option value={level} key={level}>{level}</option>;
//                         })
//                     }

//                 </select>
//                 </div>
//                 </form>
//         <AdminCalendar role={role} sessions={sessionsData}  sector={sectorSelected} year={year} group={group} reload={reload} setReload={setReload} />
//         </div>
//         <MidNavbar/>
//     </div>
//     )
// }