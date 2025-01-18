import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Cookie from 'cookie-universal';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export default function RequireLogin() {
    const cookie = Cookie();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user is authenticated
    const isAuthenticated = cookie.get('academiqa');

    // Decode user role if authenticated
    let userRole;
    if (isAuthenticated) {
        userRole = jwtDecode(isAuthenticated).role;
    }

    useEffect(() => {
        // If the user is authenticated and trying to access the login page,
        // redirect them to their home page based on their role
        if (isAuthenticated && location.pathname === "/login") {
            const homePath = userRole === "Admin" ? '/admin/home' :
                userRole === "Teacher" ? '/teacher/home' : '/student/home';
            navigate(homePath);
        }
    }, [isAuthenticated, userRole, navigate, location]);

    // If authenticated and not trying to access the login page, allow navigation through Outlet
    // Otherwise, render the Login page
    return isAuthenticated ? <Outlet /> : <Login />;
}
