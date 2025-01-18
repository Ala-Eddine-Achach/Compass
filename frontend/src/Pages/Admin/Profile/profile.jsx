import './profile.css';
import Header from "../../../Components/admin/header/header.jsx";
import {Card, CardBody, Col, Container, Row} from "reactstrap";
import avatar from "../../../assets/images/avatar3.png";
import AbsenceTable from "../../../Components/admin/AbsenceTable/AbsenceTable.jsx";
import TeacherCourses from "../../../Components/admin/TeacherCourses/TeacherCourses.jsx";
import {FaChalkboardUser} from "react-icons/fa6";
import {LiaIdCard} from "react-icons/lia";
import {TbSchool} from "react-icons/tb";
import * as PropTypes from "prop-types";
import {MdAutoGraph, MdGroups} from "react-icons/md";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookie from "cookie-universal";

function MdAutoGra(props) {
    return null;
}

MdAutoGra.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string
};
const Profile = () => {
    const userToken = Cookie().get("academiqa");
    const {id} = useParams();
    const {role} = useParams();
    const [user, setUser] = useState({});
    useEffect(() => {
        axios.get(`http://localhost:5000/${role}/${id}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(
            (response) => {
                setUser(response.data);
            }).catch((err) => {
                console.log(err);
            }
        )
    }, []);
    const [userphoto, setUserphoto] = useState(null);
    useEffect(() => {
        setUserphoto(user?.photo || avatar);
    }, [user]);
    return (
        <div>
            <Header/>
            <Container className="mt--5" fluid style={{fontSize:"18px", marginTop:'-40px'}}>
                <Row className="pe-4">
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow mx-xl-0 mx-5" style={{borderRadius: '20px'}}>
                                    <div className="card-profile-image d-flex justify-content-center">
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src={userphoto}
                                                style={{width: "150px", height: "150px", marginTop:"-30px"}}
                                            />
                                        </a>
                                    </div>
                            <CardBody className="pt-0 pt-md-4 d-flex flex-column align-items-center">
                                <h1 className="mb-3 fw-bold"> {user.username}</h1>
                                {role === "teacher" ?(<div style={{width: "fit-content"}}>
                                    <div className="d-flex">
                                        <FaChalkboardUser className="min-w-6 mr-2" size={25}/>
                                        <h3>
                                            <b>Speciality:</b> {user.speciality}
                                        </h3>
                                    </div>
                                </div>):
                               (<div className="d-flex flex-column justify-content-start">
                                   <div className="mt-1" style={{width: "fit-content"}}>
                                       <div className="d-flex">
                                           <LiaIdCard className="min-w-6 mr-2" size={25}/>
                                           <h3>
                                               <b>Enrollment number:</b> {user.enrollmentNumber}
                                           </h3>
                                       </div>
                                   </div>
                                   <div className="mt-2"  style={{width: "fit-content"}}>
                                       <div className="d-flex">
                                           <TbSchool className="min-w-6 mr-2" size={25}/>
                                           <h3>
                                               <b>Sector:</b> {user.group?.sector}
                                           </h3>
                                       </div>
                                   </div>
                                   <div className="mt-2" style={{width: "fit-content"}}>
                                       <div className="d-flex">
                                           <MdAutoGraph className="min-w-6 mr-2" size={25}/>
                                           <h3>
                                               <b>Level:</b> {user.group?.level}
                                           </h3>
                                       </div>
                                   </div>
                                   <div className="mt-2" style={{width: "fit-content"}}>
                                       <div className="d-flex">
                                           <MdGroups className="min-w-6 mr-2" size={25}/>
                                           <h3>
                                               <b>Group: </b> {user.group?.group}
                                           </h3>
                                       </div>
                                   </div>


                               </div>)}
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="order-xl-1" xl="8">
                        {role === 'student' ? <AbsenceTable id={id}/> : <TeacherCourses/>}
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default Profile;