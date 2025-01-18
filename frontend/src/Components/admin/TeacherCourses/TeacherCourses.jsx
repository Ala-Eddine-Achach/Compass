import {useState} from "react";
import {Card, CardHeader, Container, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen} from "@fortawesome/free-solid-svg-icons";

const TeacherCourses = () => {
    const [courses, setCourses] = useState([
        { id: 1, name: 'Analyse', module: 'Mathématique', sectorLevel:'GL3'  },
        { id: 2, name: 'Programmation', module: 'Informatique', sectorLevel:'GL3'  },
        { id: 3, name: 'Réseau', module: 'Réseau',sectorLevel:'GL3'  },
        { id: 4, name: 'Base de données', module: 'Informatique',sectorLevel:'GL3' },
    ]);

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
                        <th scope="col">Sector and Level</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.module}</td>
                                <td>{course.sectorLevel}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
}

export default TeacherCourses;