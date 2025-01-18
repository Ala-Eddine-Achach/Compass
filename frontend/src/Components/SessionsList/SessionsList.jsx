import "./SessionsList.css";
import SessionButton from "../SessionButton/SessionButton";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import noSessions from "../../assets/images/no_sessions.png";

function SessionsList({sessions}) {

    return (
        <div className="sessions-box ">
            <div className="sessions-title font-IstokWebBold mt-2 overflow-hidden ">Sessions</div>
            <Scrollbar trackColor="#C4B3CC" thumbColor="#692E5F" maxHeight="453px">
                <div className="sessions mr-2 h-[449px] position-relative">
                    {sessions?.length === 0 && (
                        <div className="no-sessions e-auto-fit-content position-absolute top-50 start-50 translate-middle">
                            <img src={noSessions} alt="No Sessions"/>
                        </div>
                    )}

                    {sessions?.map((session, index) => (
                        <SessionButton key={index} session={session}/>
                    ))}
                </div>
            </Scrollbar>
        </div>
    );
}

export default SessionsList;