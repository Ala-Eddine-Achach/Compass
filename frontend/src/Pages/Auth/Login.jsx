
import '../../Components/SideBar/bars.css'
import logo from '../../assets/SideBar/Logo.png'
import '../../Components/Calendar/styles.css'
import './login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Loading from '../../Components/Loading/Loading'
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../../Components/Auth/ChangePassword'
import axios from 'axios';
import { AUTH, LOGIN, baseURL } from '../../Api/Api';
import Cookie from 'cookie-universal';
import {jwtDecode} from "jwt-decode";
import { CurrentUser } from '../../Context/CurrentUserContext'
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Preloader from "../../Components/Preloader/Preloader.jsx";



export default function Login() {
    // current user context:
    const userContext = useContext(CurrentUser);
    // ref
    const focus = useRef(null);

    const cookie = Cookie();

    const [changePassword, setChangePassword] = useState(false);
    // form state
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    console.log("Form:", form);

     // loading state
         // navigate
    const navigate = useNavigate();
    const [error, setError] = useState('');

        // handle change form
        function handleChange(e) {
            setForm({
                ...form,
                [e.target.id]: e.target.value
            })
        }

        // handle focus
        useEffect(() => {
            focus.current.focus();
        }, [])

        // handle submit
        async function handleSubmit(e) {
            e.preventDefault();

            try {
                console.log(" Inside handleSubmit");
                await axios.post(`${baseURL}/${AUTH}/${LOGIN}`, form).then(res => {
                    console.log(res);
                    console.log(res.data);
                    const token = res.data.accessToken;
                    // cookie
                    cookie.set('academiqa', token, {
                        path: '/',
                        // httpOnly: true

                    });


                    // decode the jwt token using jwt-decode:
                    const user = jwtDecode(token);
                    console.log(user);

                    // context
                    userContext.setCurrentUser(user);
                    //console.log("userContext:", userContext.currentUser);


                    const path = user.role === "Admin" ? '/admin/home' : user.role === "Teacher" ? '/teacher/home' : user.role === "Student" ? '/student/home' : '/';
                    userContext.setLoading(true);
                    console.log("Path:", path);
                    // window.location.pathname = path;
                    navigate(path);

                })
            }
            catch (error) {
                userContext.setLoading(false);
                console.log(error.response);
                console.log(error.response.status);
                if (error.response.status === 404) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error("Internal server error. Please try again later.");
                }
            }
        }


    useEffect(() => {
        if (userContext.currentUser) {
            //console.log("Current user set in context:", userContext.currentUser);
        }
    }, [userContext.currentUser]);


        function validateEmail(email) {
            // Regular expression for basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+[^\s@]+$/;
            return emailRegex.test(email);
          }

    return (
        <>
        <div className='login-layout-container'>
            <div className="login-side-bar pt-5" >
                {/* Logo */}
                <img src={logo} alt="Logo" className='login-logo'/>
                {/* Bar Content */}
                <p className='login-logo-description'>Learning Beyond Limits</p>
                <div style={{marginTop: '80px', marginBottom:'40px'}}>
                    <div className='d-flex align-items-center gap-3 login-bar-content' >
                        <FontAwesomeIcon
                        className="gap-3 side-bar-link "
                        icon={faCircleCheck}
                        />
                        <p className='cursor-default login-bar-text'> Organized Sessions </p>
                    </div>
                    <div className='d-flex align-items-center gap-3 login-bar-content ' >
                        <FontAwesomeIcon
                        className="gap-3 side-bar-link"
                        icon={faCircleCheck}
                        />
                        <p className='cursor-default login-bar-text'> Intelligent Presence System </p>
                    </div>
                    <div className='d-flex align-items-center gap-3 login-bar-content ' >
                        <FontAwesomeIcon
                        className="gap-3 side-bar-link"
                        icon={faCircleCheck}
                        />
                        <p className='cursor-default login-bar-text'> Limitless AI Assistance </p>
                    </div>
                    <div className='d-flex align-items-center gap-3 login-bar-content ' >
                        <FontAwesomeIcon
                        className="gap-3 side-bar-link"
                        icon={faCircleCheck}
                        />
                        <p className='cursor-default login-bar-text'> And Much More ... </p>
                    </div>
                </div>
            </div>

            <div className='login-layout-content' >
                <h1 className='login-title' >Sign in</h1>

                <Form className='form form-login'
                onSubmit={handleSubmit}
                >
                        <div className="custom-form">
                            <Form.Group className="mb-3 form-custom" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="example@example.com" value={form.email}
                                    onChange={handleChange}
                                    required ref={focus} />
                                {/* <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                        </Form.Text> */}
                            </Form.Group>

                            <Form.Group className="mb-3 form-custom" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="" value={form.password}
                                    onChange={handleChange}
                                    required minLength="6" />
                                <div className=" mt-3">
                                    <a href='#' className=' text-muted text-decoration-none '>Forgot Password
                                        ? </a>
                                </div>

                            </Form.Group>
                            {/* button and alerts */}
                            <div>
                                <div className="d-flex">
                                    <div>
                                        <button
                                        className={`login-button ${(!validateEmail(form.email) || form.password.length<6) ? 'login-button-disabled' : ''}`}
                                        type="submit"
                                        > Login
                                        </button>
                                    </div>
                                </div>
                                {error !== "" &&
                                    <span className='error'>
                                        {error}
                                    </span>}
                            </div>
                        </div>
                    </Form>
                    <ChangePassword isOpen={changePassword} setIsOpen={setChangePassword}/>

            </div>
            <ToastContainer
                position="top-right"
                autoClose="4000"
                theme="colored"
            />
        </div>


        </>
        )

}