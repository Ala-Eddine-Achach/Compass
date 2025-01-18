import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Inject,
  ViewsDirective,
  ViewDirective,
  dataBinding,
  dataBound,
} from "@syncfusion/ej2-react-schedule";
import "./styles.css";


import { Internationalization } from "@syncfusion/ej2-base";
import { useNavigate } from "react-router-dom";
import { registerLicense } from '@syncfusion/ej2-base';
import { useContext } from "react";
import { CurrentUser } from "../../Context/CurrentUserContext";

registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cWWFCeEx1WmFZfVpgcl9GYVZSTGY/P1ZhSXxXdkBjXX5WcXRVT2RUVkc=');

const FirstCalendar = ({role, sessions}) => {
  const nav = useNavigate();
  const instance = new Internationalization();
  const getTimeString = (value) => {
    return instance.formatDate(value, { skeleton: "hm" });
  };
  const userContext = useContext(CurrentUser);
  const user = userContext.currentUser;


  const eventTemplate = (props) => {
    return (
      <div
        className={`e-appointment ${props?.type == "Lecture" ? "beige" : props?.type == "TP" ? "green" : "blue"} `}
        onClick={() => {
          // window.location.pathname = `${role}/session/${props.Id}`;
          // nav(`/${role}/session/${props?.id}`);
      }}
      >
        <div className="subject"><b>{props?.Subject}</b>: {props?.type}</div>
        <div className="time">{getTimeString(props?.StartTime)} :{getTimeString(props?.EndTime)}</div>
        <div className="time">{user?.group?.sectorLevel} </div>
      </div>
    );
  };


  const eventSettings = {
    dataSource: sessions,
    fields: {
      id: 'Id',
      subject: { name: 'Subject', title: 'Subject' },
      location: { name: 'type', title: 'Session Type' },
    }
    // template: role === 'student' ? eventTemplate : null,
  };

  return (
    <div>
      
    <ScheduleComponent
      width="100%"
      height="70vh"
      // selectedDate={new Date(2018, 1, 15)}
      eventSettings={eventSettings}
      readOnly={true}
      popupOpen={(args) => {
        args.cancel = true;
      }}
      showQuickInfo={false}
      eventClick={(args) => {
        nav(`/student/session/${+args.event.id}`);
      }}
      


      
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" startHour="05:00" endHour="23:00" />
        <ViewDirective option="WorkWeek" startHour="08:00" endHour="18:00" isSelected={true}/>
      </ViewsDirective>
      <Inject services={[Day, Week, WorkWeek, Month]} />
    </ScheduleComponent>
    </div>
  );
};

export default FirstCalendar;
