import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CurrentUser } from "../../Context/CurrentUserContext";
import Unauthorized from "./Unauthorized";
import Cookie from 'cookie-universal';
import { jwtDecode } from "jwt-decode";

export default function RequireRole({ allowedRole }) {

    const navigate = useNavigate();
    const userContext = useContext(CurrentUser);
    const cookie = Cookie();
    const userToken = cookie.get('academiqa');
    const role = jwtDecode(userToken).role;

    // console.log("userContext: ", userContext);
    return  (
        allowedRole.includes (role.toLowerCase()) ? (
            <Outlet/>
        ) : (
            <Unauthorized/>
        )
    );
}

