import avatar2 from "../../../assets/images/avatar2.png";
import admin from "../../../assets/images/administration.svg"
import './Notif.css';
import Markdown from "react-markdown";
import {useContext, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {CurrentUser} from "../../../Context/CurrentUserContext.jsx";
import {SESSION} from "../../../Api/Api.jsx";
// eslint-disable-next-line react/prop-types
const Notif = ({notification, setIsVisible}) => {
    const notificationTypes = {
        "absence-limit": 0,
        "content": 1,
        "message": 2,
        "absent": 3,
        "new_announcement": 4,
    };
    const {currentUser} = useContext(CurrentUser);
    const navigate = useNavigate();
    const handleClick = () => {
        if (linkTo) {
            navigate(linkTo);
            setIsVisible(false);
        }
    };

    //yellow => new announcement red => admin Absences Limits, green => content added,blue => new msg, pink => marked absent
    const colors = ['#fdcdc9', '#f2f9f0', '#f5faf9', '#fbf2ef','#fbf4ea'];
    let linkTo;
    if (notification?.notificationType === 'new_announcement') {
        linkTo = `/course/${notification.link}`;
    } else if (notification?.notificationType === 'content' || notification?.notificationType === 'message') {
        linkTo = `/${currentUser?.role}/${SESSION}/${notification.link}`;
    }
    const formattedDate = new Date(notification?.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const formattedTime = new Date(notification?.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return (
        <div onClick={handleClick} className="notif d-flex align-items-center" style={{backgroundColor: colors[notificationTypes[notification?.notificationType]]}}>
            <div className="img" style={{ flex: 'none' }}>
                {notification?.senderImage === "admin" ? (<img
                        style={{width: '100%', height: 'auto'}}
                        className={`img`}
                        alt={"admin"}
                        src={admin}
                    />) :
                    <img
                        style={{width: '100%', height: 'auto'}}
                        className={`img rounded-circle`}
                        alt={notification?.senderImage}
                        src={notification?.senderImage || avatar2}
                    />
                }
            </div>
            <div className="notification-content ms-3">
                <Markdown>
                    {notification.content}
                </Markdown>
                <div className="notification-date">
                    {formattedDate} {formattedTime}
                </div>
            </div>

        </div>
    );

};

export default Notif;