// TableStudents.js
import {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardHeader,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Table,
    UncontrolledDropdown
} from 'reactstrap';
import './TableTeachers.css';
import axios from "axios";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaEllipsisVertical } from "react-icons/fa6";
import {FaChalkboardTeacher, FaEye} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import PopUp from "../../Common/PopUp/PopUp.jsx";
import {NavLink} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookie from "cookie-universal";

const TableTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const userToken = Cookie().get('academiqa');
    const [isHovered, setIsHovered] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        speciality: "",
        cin: 0,
    });
    const [updateFormData, setUpdateFormData] = useState({
        username: "",
        email: "",
        speciality: "",
        cin: 0,
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleUpdateInputChange = (event) => {
        const { name, value } = event.target;
        setUpdateFormData({ ...updateFormData, [name]: value });
    }
    const [done, setDone] = useState(false);
    const [isOpen, setIsOpen] =useState(false);
    // const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [teacherModalOpen, setTeacherModalOpen] = useState({});

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
        },
    };
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(file)
        //read csv file
        formData.append('file', file);
        axios.post('http://localhost:5000/auth/teachers', formData, config).then(r => {
            console.log(r)
            getTeachers();
            setDone(false);
            setFile(null);
            document.getElementById('csv-upload').value = null;
        }).catch(e => {
            console.log(e)
            getTeachers();
            setDone(false);
            setFile(null);
            document.getElementById('csv-upload').value = null;
            toast.error(`Error while importing data\nEmails already exist\n\n${e.response.data.message.join('\n')}`)
        })
    }
    const handleFileCLick = () => {
        document.getElementById('csv-upload').click();
    }
    // const handleImageClick = () => {
    //         document.getElementById('teacher-image').click();
    // }
    // const handleImageChange = (e) => {
    //     setFormData({ ...formData, image: e.target.files[0] });
    // }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setDone(true);
    }
    const handleUpdateSubmit = (e, teacher) => {
        e.preventDefault();
        console.log(teacher)
        axios.patch('http://localhost:5000/teacher/'+teacher.id, updateFormData,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(r => {
            console.log(r)
            getTeachers();
            setUpdateFormData({
                username: "",
                email: "",
                speciality: "",
                cin: 0,
            });
            toggleTeacherModal(teacher.id);
        }).catch(e => {
            console.log(e)
            toast.error(e.response.data.message)
        })

    }
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTeachers = teachers.filter(
        (teacher) =>
            teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.speciality.toLowerCase().includes(searchTerm.toLowerCase())||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase())||
            teacher.cin.toString().includes(searchTerm.toLowerCase())
    );
    const handleCancel = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            speciality: "",
            cin: 0,
        })
    };
    const handleCancelUpdate = (teacher) => {
        setUpdateFormData({
            username: teacher.username,
            email: teacher.email,
            speciality: teacher.speciality,
            cin: teacher.cin,
        })
    };
    const handleUpdateClick = (teacher) => {
        setUpdateFormData({
            username: teacher.username,
            email: teacher.email,
            speciality: teacher.speciality,
            cin: teacher.cin,
        });
        toggleTeacherModal(teacher.id);
    };
    const toggleModal = () => setIsOpen(!isOpen);

    // const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);
    const toggleTeacherModal = (teacherId) => {
        setTeacherModalOpen((prevState) => ({
            ...prevState,
            [teacherId]: !prevState[teacherId],
        }));
    };
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        speciality: "",
        cin: "",
    });
    const handleSubmitTeacher = (e) => {
        e.preventDefault();
        console.log(formData);
        let newErrors = {
            username: "",
            email: "",
            password: "",
            speciality: "",
            cin: "",
        };

        // Validate each field
        if (!formData.username) {
            newErrors.username = "Username is required.";
        }
        if (!formData.email) {
            newErrors.email = "Email is required.";
        }
        if(formData.password.length < 6){
            newErrors.password = "Password must be at least 6 characters long.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        }
        if (!formData.speciality) {
            newErrors.speciality = "Speciality is required.";
        }
        if (!formData.cin) {
            newErrors.cin = "CIN is required.";
        }

        setErrors(newErrors);

        if(!Object.values(newErrors).some(error => error !== "")){
            // Call the API to update the teacher
            axios.post('http://localhost:5000/auth/teacher', formData,{
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            }).then(r => {
                console.log(r);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    speciality: "",
                    cin: 0,
                });
                toggleModal();
                getTeachers();
            }).catch(e => {
                toast.error(e.response.data.message)
            })

        }
    };
const getTeachers = () => {
    axios.get('http://localhost:5000/teacher/all',{
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    }).then(r => {
        setTeachers(r.data)
    }).catch(e => {
        console.log(e)
    })
}
    const handleDeleteTeacher = (e,teacher) => {
        e.preventDefault();
        // Call the API to delete the teacher
        axios.delete('http://localhost:5000/user/' + teacher.id,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(r => {
            console.log(r)
        getTeachers();
        }).catch(e => {
            console.log(e)
        })

    }
    useEffect(() => {
        getTeachers()
    },[])

    return (
        <Container className="all-teachers" fluid style={{marginTop:'-50px',padding:"0 48px",height:'100%', marginBottom:'30px'}}>
            {/* Table */}
            <Card className="shadow table-teacher">
                <CardHeader className="border-0 bg-white">
                    {/* Filter Dropdowns on Left */}
                    <div className='row pt-3 pb-2'>
                        <h1 className="col-12 d-flex fs-2 fw-bold justify-content-center listEnseignant">Teachers</h1>

                    </div>
                    <div className='mb-1 d-flex justify-content-between'>
                        <div className='col-lg-3 col-md-4 col-sm-2 d-flex filter'>
                            <div className="container-input">
                                <input type="text" placeholder="Search" name="text" className="input" value={searchTerm}
                                       onChange={handleSearchChange}/>
                                    <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fillRule="evenodd"></path>
                                    </svg>
                            </div>
                        </div>

                        {/* Add Teacher Button in Center */}
                        <div className="d-flex">
                            <div className="d-flex AddEtudiant justify-content-end   ">
                                <Button onClick={toggleModal} className="addbtn ">
                                    Add teacher
                                </Button>
                            </div>
                            <div className="ms-3 d-flex AddEtudiant justify-content-end multiple-teachers">
                                <Button
                                    onClick={handleFileCLick}
                                    className="addbtn"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    {isHovered && !done && (<span style={{fontSize: '14.25px'}}>
                                        Please upload a CSV file
                                    </span>) }
                                    {!isHovered && !done &&(<span> Import teachers data </span>)}
                                    {done && <span> {file.name} </span>}
                                </Button>
                                {done && (
                                    <div className="transform transition-transform duration-300 hover:scale-110  d-flex align-items-center ms-1" onClick={handleSubmit}>
                                        <IoMdCheckmarkCircleOutline fill={"#692E5F"} size={30} className="cursor-pointer"/>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="file"
                                    className="image-prompt"
                                    style={{ display: "none" }}
                                    accept=".csv"
                                    id="csv-upload"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                {/* Table Content */}
                <Table className="align-items-center table-flush" responsive>
                    <thead className="head-table">
                    <tr>
                        <th scope="col">Email address</th>
                        <th scope="col">Identity Card</th>
                        <th scope="col">Name</th>
                        <th scope="col">Speciality</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Display filtered teachers or message if none found */}
                    {filteredTeachers.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>No teacher found.</td>
                        </tr>
                    ) : (
                        filteredTeachers.map((teacher) => (
                            <tr key={teacher.id}>
                                <td>{teacher.email}</td>
                                <td>{teacher.cin}</td>
                                <td>{teacher.username}</td>
                                <td>{teacher.speciality}</td>

                                <td>
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            className="btn-icon-only text-light"
                                            role="button"
                                            size="sm"
                                            color=""
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <FaEllipsisVertical fill={"#606060"}/>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-arrow" style={{boxShadow:'0px 8px 16px 0px rgba(0,0,0,0.2)',border:'none'}} end>

                                            <NavLink to={"/admin/profile/" + teacher.id + "/" + "teacher"}>
                                                <DropdownItem
                                                    className="d-flex align-items-center"
                                                >
                                                    <FaEye size={20} className="me-1"/>
                                                    View profile
                                                </DropdownItem>
                                            </NavLink>

                                            <DropdownItem
                                                onClick={() => handleUpdateClick(teacher)}
                                                className="d-flex align-items-center"
                                            >
                                                <FontAwesomeIcon icon={faPen} className="me-2" />
                                                Update
                                            </DropdownItem>

                                            {/* Update Student Modal */}

                                            <DropdownItem
                                                onClick={(e) => handleDeleteTeacher(e,teacher)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                Delete
                                            </DropdownItem>
                                            <PopUp width={`${screenWidth > 740 ? '35vw' : '60vw'} `}
                                                   isOpen={teacherModalOpen[teacher.id] || false}
                                                   setIsOpen={() => toggleTeacherModal(teacher.id)}
                                                   fromCourse={true}>
                                                <div className="d-flex align-items-center ms-4">
                                                    <FaChalkboardTeacher size={25} className="mb-1 me-2"/>
                                                    <p className="fs-5 fw-bold ms-1 mb-1 add-teacher"> Update teacher:</p>
                                                </div>
                                                <form onSubmit={(e) => handleUpdateSubmit(e, teacher)}
                                                      onReset={() => handleCancelUpdate(teacher)}
                                                      className="link-form add-new d-flex flex-column align-items-center">
                                                    <div className="mt-3" style={{width: "90%"}}>
                                                        <label htmlFor="module">Username:</label>
                                                        <input
                                                            type={"text"}
                                                            name="username"
                                                            value={updateFormData.username}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter username"
                                                        />
                                                    </div>
                                                    <div style={{width: "90%"}}>
                                                        <label htmlFor="module">Email:</label>
                                                        <input
                                                            type={"email"}
                                                            name="email"
                                                            value={updateFormData.email}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter email"
                                                        />
                                                    </div>
                                                    <div style={{width: "90%"}}>
                                                        <label htmlFor="module">Speciality:</label>
                                                        <input
                                                            type={"text"}
                                                            name="speciality"
                                                            value={updateFormData.speciality}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter speciality"
                                                        />
                                                    </div>
                                                    <div style={{width: "90%"}}>
                                                        <label htmlFor="cin">CIN:</label>
                                                        <input
                                                            type={"number"}
                                                            name="cin"
                                                            value={updateFormData.cin}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter cin"
                                                        />
                                                    </div>
                                                    <div className="end d-flex justify-content-between mt-4"
                                                         style={{width: '70%'}}>
                                                        <button type="submit" className="me-1">
                                                            Update
                                                        </button>
                                                        <button type="reset" className="ms-1">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </PopUp>


                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>

                            </tr>
                        ))
                    )}
                    </tbody>
                </Table>
            </Card>
            {/* Add Teacher Modal */}
            <div className="add-one-teacher-modal">
                <PopUp width={`${screenWidth > 740 ? '35vw' : '60vw'} `} isOpen={isOpen} setIsOpen={setIsOpen}
                       fromCourse={true}>
                    <div className="d-flex align-items-center ms-4">
                        <FaChalkboardTeacher size={25} className="mb-1 me-2"/>
                        <p className="fs-5 fw-bold ms-1 mb-1 add-teacher"> Add teacher:</p>
                    </div>
                    <form onSubmit={handleSubmitTeacher} onReset={handleCancel}
                          className="link-form add-new new d-flex flex-column align-items-center">
                        <input
                            type={"text"}
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                        />
                        {errors.username && <p style={{color: "#b41b1b"}}>{errors.username}</p>}
                        <input
                            type={"email"}
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email: example@example.com"
                        />
                        {errors.email && <p style={{color: "#b41b1b"}}>{errors.email}</p>}
                        <input
                            type={"password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                        />
                        {errors.password && <p style={{color: "#b41b1b"}}>{errors.password}</p>}
                        <input
                            type={"text"}
                            name="speciality"
                            value={formData.speciality}
                            onChange={handleInputChange}
                            placeholder="Enter speciality"
                        />
                        {errors.speciality && <p style={{color: "#b41b1b"}}>{errors.speciality}</p>}
                            <input
                                type={"number"}
                                name="cin"
                                onChange={handleInputChange}
                                placeholder="Enter cin"
                            />
                        {errors.cin && <p style={{color: "#b41b1b"}}>{errors.cin}</p>}
                        {/*<input type={"file"} name="photo" id="teacher-image" accept="image/*"*/}
                        {/*       onChange={handleImageChange} style={{display: "none"}}/>*/}
                        {/*<div className="d-flex justify-content-start" style={{width: "100%"}}>*/}
                        {/*    <Button className="d-flex align-items-center add-photo ms-3" onClick={handleImageClick}>*/}
                        {/*        <LuImagePlus size={30}/>*/}
                        {/*        <p className="ms-2"> {!formData.image ? ("Add photo") : formData.image.name} </p>*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                        <div className="end d-flex justify-content-between mt-4" style={{width: '70%'}}>
                            <button type="submit" className="me-1">
                                Add
                            </button>
                            <button type="reset" className="ms-1">
                                Cancel
                            </button>
                        </div>
                    </form>
                </PopUp>
            </div>
            <ToastContainer
                position="bottom-right"
                // autoClose="4000"
                autoClose={false}
                theme="colored"
            />
        </Container>
    );
};

export default TableTeachers;
