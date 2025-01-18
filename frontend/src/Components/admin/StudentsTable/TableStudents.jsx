// TableStudents.js
import React, {useContext, useEffect, useState} from 'react';
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
import Select from 'react-select';
import axios from "axios";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaEye} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import PopUp from "../../Common/PopUp/PopUp.jsx";
import {PiStudentBold} from "react-icons/pi";
import {NavLink} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import Cookie from "cookie-universal";
import ToastContext from "react-bootstrap/ToastContext";

// eslint-disable-next-line react/prop-types
const TableStudents = ({groups}) => {
    const userToken = Cookie().get('academiqa');
    const [Options, setOptions] = useState([]);
    useEffect(() => {
        setOptions(groups.map(group => ({
            value: group,
            label: `${group.sectorLevel} group ${group.group}`
        })));
    }, [groups]);
    const {showToast} = useContext(ToastContext);

    const [students, setStudents] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        enrollmentNumber: 0,
        group: {},
        cin: 0,
    });
    const [updateFormData, setUpdateFormData] = useState({
        username: "",
        email: "",
        enrollmentNumber: 0,
        group: {},
        cin: 0,
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleUpdateInputChange = (event) => {
        const { name, value } = event.target;
        console.log(event)
        setUpdateFormData({ ...updateFormData, [name]: value });
    }
    const handleSelectOptionChange = (selectedOption) => {
        const { value } = selectedOption;
        const existingOption = Options.find(option => option.value.id === value.id);

        if (existingOption) {
            const groupObject = {
                id: existingOption.value.id,
                label: existingOption.label
            };
            setUpdateFormData({ ...updateFormData, group: groupObject });
        } else {
            console.warn("Invalid option selected");
        }
    };



    useEffect(() => {
        console.log("Updated group:", updateFormData.group);
    }, [updateFormData.group]);

    const handleSelectOptionAddChange = (selectedOption) => {
        const { value } = selectedOption;
        setFormData({ ...formData, group: value });
        console.log(formData)
    }
    const [done, setDone] = useState(false);
    const [isOpen, setIsOpen] =useState(false);
    // const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [studentModalOpen, setStudentModalOpen] = useState({});

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
        axios.post('http://localhost:5000/auth/students', formData, config).then(r => {
            console.log(r)
            getStudents();
            setDone(false)
            setFile(null)
            showToast('Students imported successfully', 'success');
            document.getElementById('csv-upload').value = null;
        }).catch(e => {
            console.log(e)
            setDone(false);
            setFile(null);
            document.getElementById('csv-upload').value = null;
            toast.error(`Error while importing data\n${e.response.data.message.join('\n')}`)
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
        console.log(e.target)
        setFile(e.target.files[0]);
        setDone(true);
    }

    const handleUpdateSubmit = (e,student) => {
        e.preventDefault();
        console.log(updateFormData)

        axios.patch('http://localhost:5000/student/' + student.id, updateFormData,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(r => {
            console.log(r)
            getStudents();
            setUpdateFormData(
                {
                    username: "",
                    email: "",
                    enrollmentNumber: 0,
                    group: {},
                    cin: 0,
                }
            )
            toggleStudentModal(student.id);
        }).catch(e => {
            console.log(e)
            toast.error(e.response.data.message)
        })

    }
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredStudents = students.filter(
        (student) =>
            student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())||
            student.enrollmentNumber.toString().includes(searchTerm.toLowerCase())||
            student.cin.toString().includes(searchTerm.toLowerCase())
    );
    const handleCancel = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            image: null,
            enrollmentNumber: 0,
            group: null,
            cin: 0,
        })
    };
    const handleCancelUpdate = (student) => {
        const groupOption = Options.find(option => option.value.id === student.group?.id) || {};
        setUpdateFormData({
            username: student.username,
            email: student.email,
            password: student.password,
            enrollmentNumber: student.enrollmentNumber,
            group: groupOption,
            cin: student.cin,
        })
    };
    const handleUpdateClick = (student) => {
        const groupOption = Options.find(option => option.value.id === student.group?.id) || {};
        setUpdateFormData({
            username: student.username,
            email: student.email,
            enrollmentNumber: student.enrollmentNumber,
            group: groupOption,
            cin: student.cin,
        });
        console.log(groupOption)
        toggleStudentModal(student.id);
    };
    const toggleModal = () => setIsOpen(!isOpen);

    // const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);
    const toggleStudentModal = (studentId) => {
        setStudentModalOpen((prevState) => ({
            ...prevState,
            [studentId]: !prevState[studentId],
        }));
    };
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        enrollmentNumber: "",
        group: "",
        cin: "",
    });
    const handleSubmitStudent = (e) => {
        e.preventDefault();
        console.log(formData);
        let newErrors = {
            username: "",
            email: "",
            password: "",
            enrollmentNumber: "",
            group: "",
            cin: "",
        };
        if(!formData.username) {
            newErrors.username = "Username is required";
        }
        if(!formData.email) {
            newErrors.email = "Email is required";
        }
        if(formData.password.length < 6){
            newErrors.password = "Password must be at least 6 characters long.";
        }
        if(!formData.password) {
            newErrors.password = "Password is required";
        }
        if(!formData.enrollmentNumber) {
            newErrors.enrollmentNumber = "Enrollment number is required";
        }
        if(!formData.group || !formData.group) {
            newErrors.group = "Group is required";
        }
        if(!formData.cin) {
            newErrors.cin = "CIN is required";
        }
        setErrors(newErrors);
        console.log(newErrors)
        if(!Object.values(newErrors).some(error => error !== "")){
            axios.post('http://localhost:5000/auth/student', formData,{
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            }).then(r => {
                console.log(r)
                getStudents();
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    enrollmentNumber: 0,
                    group: {},
                    cin: 0,
                });
                toggleModal();
            }).catch(e => {
                console.log(e)
                toast.error(e.response.data.message)
            })

        }
    };
const getStudents= () => {

    axios.get('http://localhost:5000/student/all',{
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    }).then(r => {
        setStudents(r.data);
    }).catch(e => {
        console.log(e)
    })
}
    const handleDeleteStudent = (e,student) => {
        e.preventDefault();
        axios.delete('http://localhost:5000/user/' + student.id,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(r => {
            console.log(r)
            getStudents();
        }).catch(e => {
            console.log(e)
        })
    }
    useEffect(() => {
        getStudents();
    }, []);
    return (
        <Container className="all-teachers" fluid style={{padding:"0 48px",height:'100%', marginBottom:'30px'}}>
            {/* Table */}
            <Card className="shadow table-teacher">
                <CardHeader className="border-0 bg-white">
                    {/* Filter Dropdowns on Left */}
                    <div className='row pt-3 pb-2'>
                        <h1 className="col-12 d-flex fs-2 fw-bold justify-content-center listEnseignant">Students</h1>

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
                                    Add student
                                </Button>
                            </div>
                            <div className="ms-3 d-flex AddEtudiant justify-content-end multiple-teachers">
                                <Button
                                    onClick={handleFileCLick}
                                    className="addbtn"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    {isHovered && !done && (<span style={{fontSize: '14px'}}>
                                        Please upload a CSV file
                                    </span>) }
                                    {!isHovered && !done &&(<span> Import students data </span>)}
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
                        <th scope="col">Enrollment number</th>
                        <th scope="col">Identity card</th>
                        <th scope="col">Email address</th>
                        <th scope="col">Name</th>
                        <th scope="col">Sector</th>
                        <th scope="col">Level</th>
                        <th scope="col">Group</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Display filtered students or message if none found */}
                    {filteredStudents.length === 0 ? (
                        <tr>
                            <td colSpan={8} style={{ textAlign: 'center' }}>No student found.</td>
                        </tr>
                    ) : (
                        filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>{student.enrollmentNumber}</td>
                                <td>{student.cin}</td>
                                <td>{student.email}</td>
                                <td>{student.username}</td>
                                <td>{student.group?.sector}</td>
                                <td>{student.group?.level}</td>
                                <td>{student.group?.group}</td>

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

                                            <NavLink to={"/admin/profile/"+student.id + "/" + "student"}>
                                                <DropdownItem
                                                    className="d-flex align-items-center"
                                                >
                                                    <FaEye size={20} className="me-1"/>
                                                    View profile
                                                </DropdownItem>
                                            </NavLink>

                                            <DropdownItem
                                                onClick={() => handleUpdateClick(student)}
                                                className="d-flex align-items-center"
                                            >
                                                <FontAwesomeIcon icon={faPen} className="me-2" />
                                                Update
                                            </DropdownItem>

                                            {/* Update Student Modal */}

                                            <DropdownItem
                                                onClick={(e) => handleDeleteStudent(e,student)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                Delete
                                            </DropdownItem>
                                            <PopUp width={`${screenWidth > 740 ? '35vw' : '60vw'} `}
                                                   isOpen={studentModalOpen[student.id] || false}
                                                   setIsOpen={() => toggleStudentModal(student.id)}
                                                   fromCourse={true}>
                                                <div className="d-flex align-items-center ms-4">
                                                    <PiStudentBold  size={25} className="mb-1 me-2"/>
                                                    <p className="fs-5 fw-bold ms-1 mb-1 add-teacher"> Update student:</p>
                                                </div>
                                                <form onSubmit={(e) => handleUpdateSubmit(e, student)}
                                                      onReset={() => handleCancelUpdate(student)}
                                                      className="link-form add-new  d-flex flex-column align-items-center">
                                                    <div className="mt-3" style={{width: "90%"}}>
                                                        <label htmlFor="username">Username:</label>
                                                        <input
                                                            type={"text"}
                                                            name="username"
                                                            value={updateFormData.username}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter username"
                                                        />
                                                    </div>
                                                    <div style={{width: "90%"}}>
                                                        <label htmlFor="group">Group:</label>
                                                        <Select
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            // defaultValue={Options[0]}
                                                            value={updateFormData.group}
                                                            onChange={handleSelectOptionChange}
                                                            name="group"
                                                            options={Options}
                                                        />
                                                    </div>
                                                    <div style={{width: "90%"}}>
                                                        <label htmlFor="email">Email:</label>
                                                        <input
                                                            type={"email"}
                                                            name="email"
                                                            value={updateFormData.email}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter email: example@example.com"
                                                        />
                                                    </div>
                                                    <div style={{width: "90%"}}>
                                                        <label htmlFor="enrollmentNumber">Enrollment number:</label>
                                                        <input
                                                            type={"number"}
                                                            name="enrollmentNumber"
                                                            value={updateFormData.enrollmentNumber}
                                                            onChange={handleUpdateInputChange}
                                                            placeholder="Enter enrollment number"
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
            <PopUp width={`${screenWidth > 740 ? '35vw':'60vw'} `} isOpen={isOpen} setIsOpen={setIsOpen} fromCourse={true}>
                    <div className="d-flex align-items-center ms-4">
                        <PiStudentBold  size={25} className="mb-1 me-2"/>
                        <p className="fs-5 fw-bold ms-1 mb-1 add-teacher"> Add student:</p>
                    </div>
                <form onSubmit={handleSubmitStudent} onReset={handleCancel}
                      className="link-form add-new new d-flex flex-column align-items-center">
                    <input
                        type={"text"}
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className={`${errors.username ? 'mb-0 mt-0' : ''}`}

                    />
                    {errors.username && <p style={{color:"#b41b1b",fontSize:'14px'}}>{errors.username}</p>}
                    <input
                        type={"email"}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className={`${errors.email ? 'mb-0 mt-0' : ''}`}

                    />
                    {errors.email && <p style={{color:"#b41b1b",fontSize:'14px'}}>{errors.email}</p>}
                    <input
                        type={"password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className={`${errors.password ? 'mb-0 mt-0' : ''}`}

                    />
                    {errors.password && <p style={{color:"#b41b1b",fontSize:'14px'}}>{errors.password}</p>}
                    <Select
                        classNamePrefix="select"
                        placeholder={"Select group ..."}
                        // value={Options.find(option => option.value.id === student.group.id)}
                        onChange={handleSelectOptionAddChange}
                        name="group"
                        options={Options}
                        className={`basic-single ${errors.group ? 'mb-0 mt-0' : ''}`}

                    />
                    {errors.group && <p style={{color:"#b41b1b",fontSize:'14px'}}>{errors.group}</p>}
                    <input
                        type={"number"}
                        name="enrollmentNumber"
                        value={formData.enrollmentNumber ? formData.enrollmentNumber:""}
                        onChange={handleInputChange}
                        placeholder="Enter enrollment number"
                        className={`${errors.enrollmentNumber ? 'mb-0 mt-0' : ''}`}

                    />
                    {errors.enrollmentNumber && <p style={{color:"#b41b1b",fontSize:'14px'}}>{errors.enrollmentNumber}</p>}
                    <input
                        type={"number"}
                        name="cin"
                        value={formData.cin ? formData.cin:""}
                        onChange={handleInputChange}
                        placeholder="Enter cin"
                        className={`${errors.cin ? 'mb-0 mt-0' : ''}`}

                    />
                    {errors.cin && <p style={{color:"#b41b1b",fontSize:'14px'}}>{errors.cin}</p>}
                    {/*<input  type={"file"} name="photo" id="teacher-image" accept="image/*" onChange={handleImageChange}*/}
                    {/*       style={{display: "none"}}/>*/}
                    {/*<div className={`d-flex justify-content-start ${errors.username ? 'mb-0 mt-0' : ''}`} style={{width: "100%"}}>*/}
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

export default TableStudents;
