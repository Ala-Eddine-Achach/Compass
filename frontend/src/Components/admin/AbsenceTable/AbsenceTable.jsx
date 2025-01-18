import React, {useEffect, useState} from 'react';
import {
    Card,
    CardHeader,
    Table,
    Container,
} from "reactstrap";
import {faCheck, faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookie from "cookie-universal";
import {baseURL, PRESENCE, STUDENTSABSENCE} from "../../../Api/Api.jsx";


const TableAbsence = ({id}) => {
    const [courses, setCourses] = useState([]);
    const cookie = Cookie();
    const userToken = cookie.get('academiqa')
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };
    useEffect(() => {
        try{
            axios.get(`${baseURL}/${PRESENCE}/${STUDENTSABSENCE}/${id}`, config)
                .then((response) => {
                    setCourses(response.data);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    }, []);
    return (
        <Container className="all-teachers" fluid style={{padding:"0 48px",height:'100%', marginBottom:'30px'}}>
            <Card className="shadow table-teacher">
                <CardHeader className="border-0 bg-white">
                    <div className='row pt-3 pb-2'>
                        <h1 className="col-12 d-flex fs-2 fw-bold justify-content-center listEnseignant">Courses</h1>
                    </div>
                </CardHeader>
                {/* Table Content */}
                <Table className="align-items-center table-flush" responsive>
                    <thead className="head-table">
                    <tr>
                        <th scope="col">Course</th>
                        <th scope="col">Module</th>
                        <th scope="col">Number of absence</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.module}</td>
                                <td>
                                    <div className="d-flex justify-content-center" style={{width: '50%'}}>
                                        <span>{course.numberOfAbsence}</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
}

export default TableAbsence;
