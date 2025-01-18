import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardHeader,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import axios from "axios";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import {FaEllipsisVertical} from "react-icons/fa6";
import {FaEye} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import PopUp from "../../Common/PopUp/PopUp.jsx";
import {PiStudentBold} from "react-icons/pi";
import {LuImagePlus} from "react-icons/lu";
import Scrollbar from "../../Common/Scrollbar/Scrollbar.jsx";
import Cookie from "cookie-universal";

const AdminsTable = () => {
    const userToken = Cookie().get('academiqa');
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        image: null,
        cin: 0,
    });
    const [updateFormData, setUpdateFormData] = useState({
        username: "",
        email: "",
        cin: 0,
    });
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };
    const handleUpdateInputChange = (event) => {
        const {name, value} = event.target;
        //console.log(event)
        setUpdateFormData({...updateFormData, [name]: value});
    }
    const [done, setDone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [adminModalOpen, setAdminModalOpen] = useState({});

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
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
    const handleImageClick = () => {
        document.getElementById('teacher-image').click();
    }
    const handleImageChange = (e) => {
        setFormData({...formData, image: e.target.files[0]});
    }

    const handleUpdateSubmit = (e, admin) => {
        e.preventDefault();
        //console.log(updateFormData)

        // axios.post('http://localhost:5000/admins', formData, config).then(r => {
        //     console.log(r)
        //     getAdmins();
        // }).catch(e => {
        //     console.log(e)
        // })
        toggleAdminModal(admin.id);
    }
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredAdmins = admins.filter(
        (admin) =>
            admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.cin.toString().includes(searchTerm.toLowerCase())
    );
    const handleCancel = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            image: null,
            cin: 0,
        })
    };
    const handleCancelUpdate = (admin) => {
        setUpdateFormData({
            username: admin.username,
            email: admin.email,
            password: admin.password,
            cin: admin.cin,
        })
    };
    const handleUpdateClick = (admin) => {
        setUpdateFormData({
            username: admin.username,
            email: admin.email,
            cin: admin.cin,
        });
        toggleAdminModal(admin.id);
    };
    const toggleModal = () => setIsOpen(!isOpen);

    // const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);
    const toggleAdminModal = (adminId) => {
        setAdminModalOpen((prevState) => ({
            ...prevState,
            [adminId]: !prevState[adminId],
        }));
    };
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        image: "",
        cin: "",
    });
    const handleSubmitAdmin = (e) => {
    e.preventDefault();
    console.log(formData);
    let newErrors = {
        username: "",
        email: "",
        password: "",
        cin: "",
    };
    if (!formData.username) {
        newErrors.username = "Username is required";
    }
    if (!formData.email) {
        newErrors.email = "Email is required";
    }
    if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long.";
    }
    if (!formData.password) {
        newErrors.password = "Password is required";
    }
    if (!formData.cin) {
        newErrors.cin = "CIN is required";
    }
    setErrors(newErrors);
    if (!Object.values(newErrors).some(error => error !== "")) {
        //Call the API to register the admin
        axios.post('http://localhost:5000/auth/register', formData,{
            headers: {
                Authorization: `Bearer ${userToken}`,
            }
        }).then(r => {
            setAdmins([...admins, r.data])
        }).catch(e => {
            console.log(e)
        })
        //Reset the form data
        setFormData({
            username: "",
            email: "",
            password: "",
            cin: 0,
        });
        toggleModal();
    }
};
    const getAdmins = () => {
        axios.get('http://localhost:5000/admin/all').then(r => {
            setAdmins(r.data)
        }).catch(e => {
            console.log(e)
        })
    }
    const handleDeleteAdmin = (e) => {
        e.preventDefault();
        // Call the API to delete the admin
        // axios.delete('http://localhost:5000/admins/' + adminId).then(r => {
        //     console.log(r)
        // getAdmins();
        // }).catch(e => {
        //     console.log(e)
        // })

    }
    useEffect(() => {
        getAdmins();
    }, [done]);

    return (
        <Container fluid style={{marginBottom: '30px',marginLeft: '10px'}}>
            {/* Table */}
            <Card className="shadow admins table-teacher h-[490px] p-2">
                <CardHeader className="border-0 bg-white">
                    {/* Filter Dropdowns on Left */}
                    <div className='row pt-3 pb-2'>
                        <h1 className="col-12 d-flex fs-2 fw-bold justify-content-center listEnseignant">Admins</h1>

                    </div>
                    <div className='mb-1 d-flex justify-content-between'>
                        <div className='col-lg-3 col-md-4 col-sm-2 d-flex filter'>
                            <div className="container-input">
                                <input type="text" placeholder="Search" name="text" className="input" value={searchTerm}
                                       onChange={handleSearchChange}/>
                                <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
                                        fillRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Add admin Button in Center */}
                        <div className="d-flex">
                            <div className="d-flex AddEtudiant justify-content-end   ">
                                <Button onClick={toggleModal} className="addbtn ">
                                    Add admin
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                {/* Table Content */}
                <Scrollbar trackColor={"#f2f2f2"} thumbColor={"#ccc"} maxHeight={"340px"}>
                <Table className="align-items-center table-flush" responsive>
                    <thead className="head-table">
                    <tr>
                        <th scope="col">cin</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                    </tr>
                    </thead>

                    <tbody>
                    {/* Display filtered admins or message if none found */}
                    {filteredAdmins.length === 0 ? (
                        <tr>
                            <td colSpan={8} style={{textAlign: 'center'}}>No admin found.</td>
                        </tr>
                    ) : (
                        filteredAdmins.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.cin}</td>
                                <td>{admin.username}</td>
                                <td>{admin.email}</td>
                            </tr>
                        ))
                    )}
                    </tbody>

                </Table>
                </Scrollbar>
            </Card>
            {/* Add admin Modal */}
            <div className="add-one-teacher-modal">
                <PopUp width={`${screenWidth > 740 ? '35vw' : '60vw'} `} isOpen={isOpen} setIsOpen={setIsOpen}
                       fromCourse={true}>
                    <div className="d-flex align-items-center ms-4">
                        <PiStudentBold size={25} className="mb-1 me-2"/>
                        <p className="fs-5 fw-bold ms-1 mb-1 add-teacher"> Add admin:</p>
                    </div>
                    <form onSubmit={handleSubmitAdmin} onReset={handleCancel}
                          className="link-form add-new d-flex flex-column align-items-center">
                        <input
                            type={"text"}
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                            className={`${errors.username ? 'mb-0 mt-0' : ''}`}

                        />
                        {errors.username && <p style={{color: "#b41b1b", fontSize: '14px'}}>{errors.username}</p>}
                        <input
                            type={"email"}
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            className={`${errors.email ? 'mb-0 mt-0' : ''}`}

                        />
                        {errors.email && <p style={{color: "#b41b1b", fontSize: '14px'}}>{errors.email}</p>}
                        <input
                            type={"password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            className={`${errors.password ? 'mb-0 mt-0' : ''}`}

                        />
                        {errors.password && <p style={{color: "#b41b1b", fontSize: '14px'}}>{errors.password}</p>}
                        <input
                            type={"number"}
                            name="cin"
                            value={formData.cin ? formData.cin : ""}
                            onChange={handleInputChange}
                            placeholder="Enter cin"
                            className={`${errors.cin ? 'mb-0 mt-0' : ''}`}

                        />
                        {errors.cin && <p style={{color: "#b41b1b", fontSize: '14px'}}>{errors.cin}</p>}



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
        </Container>
    );
};

export default AdminsTable;