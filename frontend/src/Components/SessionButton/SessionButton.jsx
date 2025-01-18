import React, {useContext} from "react";
import "./SessionButton.css";
import {NavLink} from "react-router-dom";
import {CurrentUser} from "../../Context/CurrentUserContext.jsx";

function SessionButton({session}) {
    const {currentUser,user} = useContext(CurrentUser);
    return (

        <button className="sessionButton-button container "
                title={session?.name + ", " + session?.date}
        >{currentUser?.role === 'Teacher' ? (
            session?.teacherId === currentUser?.id ? (
                <NavLink to={`/${currentUser?.role}/session/${session?.id}`}>
                    <div>
                        <div
                            className="sessionButton-name font-IstokWebBold overflow-hidden text-nowrap">{session?.sessionType?.type} n°{session?.rank} {session?.sessionType?.type !== 'Lecture' && `group ${session?.group}`}</div>
                        <div
                            className="sessionButton-date font-IstokWebRegular overflow-hidden text-nowrap">{session?.date}</div>
                    </div>
                </NavLink>
            ) : (
                // No navigation link if teacherId does not match current user id
                <div>
                    <div
                        className="sessionButton-name font-IstokWebBold overflow-hidden text-nowrap">{session?.sessionType?.type} n°{session?.rank} {session?.sessionType?.type !== 'Lecture' && `group ${session?.group}`}</div>
                    <div
                        className="sessionButton-date font-IstokWebRegular overflow-hidden text-nowrap">{session?.date}</div>
                </div>
            )
        ) : (
            // Always navigate if not a teacher
            <NavLink to={`/${currentUser?.role}/session/${session?.id}`}>
                <div>
                    <div
                        className="sessionButton-name font-IstokWebBold overflow-hidden text-nowrap">{session?.sessionType?.type} n°{session?.rank} {session?.sessionType?.type !== 'Lecture' && `group ${session?.group}`}</div>
                    <div
                        className="sessionButton-date font-IstokWebRegular overflow-hidden text-nowrap">{session?.date}</div>
                </div>
            </NavLink>
        )}

        </button>

    );
}

export default SessionButton;