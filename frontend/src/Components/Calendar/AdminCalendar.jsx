import {
    ScheduleComponent,
    Day,
    Week,
    WorkWeek,
    Month,
    Inject,
    ViewsDirective,
    ViewDirective,
  } from "@syncfusion/ej2-react-schedule";
  import "./styles.css";
  import { L10n } from '@syncfusion/ej2-base';
  import { Internationalization } from "@syncfusion/ej2-base";
  import { useNavigate } from "react-router-dom";
  import { registerLicense } from '@syncfusion/ej2-base';
  import '../../Components/Calendar/styles.css'
import axios from "axios";
import {ADD_SESSION, SESSION, baseURL, SESSION_TYPE} from "../../Api/Api";
import Cookie from 'cookie-universal';
import {useContext, useEffect} from "react";
import {CurrentUser} from "../../Context/CurrentUserContext.jsx";

  registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cWWFCeEx1WmFZfVpgcl9GYVZSTGY/P1ZhSXxXdkBjXX5WcXRVT2RUVkc=');
  
  
  const AdminCalendar = ({role, sessions, sector, year, group, reload, setReload}) => {

    useEffect(() => {
      // console.log("props received in AdminCalendar:", role, sessions, sector, year, group, reload);
    }, [role, sessions, sector, year, group, reload]);
    

    const nav = useNavigate();
    const instance = new Internationalization();
    const getTimeString = (value) => {
      return instance.formatDate(value, { skeleton: "hm" });
    };
    const cookie = Cookie();
    const token = cookie.get('academiqa');

    L10n.load({
      'en-US': {
          'schedule': {
              'saveButton': 'Save',
              'cancelButton': 'Close',
              'deleteButton': 'Remove',
              'newEvent': 'Add Session',
              'editEvent': 'Edit Session',
          },
      }
  });


  const editTimeFormat = (data) => {
    const dateObject = new Date(data.StartTime);
    data.StartTime = dateObject.toISOString();
    const endDateObject = new Date(data.EndTime);
    data.EndTime = endDateObject.toISOString();
    return data;
  }

  const typeOrGroup = sessions[0]?.sessionType?.group? "group": "type";

    const eventSettings = {
      dataSource: sessions,
      fields: {
        id: 'Id',
        subject: { name: 'Subject', title: 'Subject' },
        location: { name: typeOrGroup, title: `Session ${typeOrGroup=="group"?"Group":"Type"}` },
      },
    };

    const {user, currentUser} = useContext(CurrentUser);
    return (
      <div>
      <ScheduleComponent
        width="100%"
        height="70vh"
        // selectedDate={new Date(2018, 1, 15)}
        eventSettings={eventSettings}
        allowDragAndDrop={true}
        allowResizing={true}
        showQuickInfo = {false}
        hover={(args) => {
          if( role == "admin" && !(sector && year && group)) {args.element.setAttribute('title', 'select a group');}
          else{
            if(role != "teacher" ) {
            if (args.element.classList[0]=="e-work-cells" ) {
              args.element.setAttribute('title', 'double click to add a session');
            }
            if (args.element.classList[0]=="e-appointment") {
            args.element.setAttribute('title', 'double click to edit the session');
            }
          }
        }}
        }
        popupOpen={(args) => {
          if (role === "teacher" || !(sector && year && group)) {
            args.cancel = true;
          }
          args.duration = 90; // set the default duration of the event to 90 minutes
        }}
        cellClick={
          (args) => {
            args.cancel = true;
        }}

        eventClick={
          async (args) => {
            let teacherId
            if (role === "teacher") {
              //console.log("args.event.teacherId:", args.event);
                //console.log("currentUser.id:", currentUser.id);
                await axios.get(`${baseURL}/${SESSION_TYPE}/${args.event?.sessionType?.id || args.event?.sessionTypeId}/teacher-id`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    }).then(
                    (response) => {
                      teacherId = response.data;
                    }).catch((err) => {
                        console.log(err);
                    });
              //console.log("teacherId:", teacherId);
              if(teacherId === currentUser?.id) {
                nav(`/teacher/session/${args.event.id}`);
              }
            }
          }
        }
        actionComplete={(args) => {
          if (args.requestType === "eventChanged") {
            editTimeFormat(args.data[0]);
            //console.log(args.data[0]);
            const dto = {
              date: args.data[0].StartTime,
              endTime : args.data[0].EndTime,
              name: args.data[0].Subject,
            }
            axios.patch(`${baseURL}/${SESSION}/${args.data[0].id}`, dto, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then(
              (response) => {
                //console.log("response.data:", response.data);
                alert("Session Updated");
                setReload(!reload);
              }).catch((err) => {
                console.log(err);
              });

          }
          if (args.requestType === "eventCreated") {
            editTimeFormat(args.data[0]);
            //console.log(args.data[0]);
            alert("Session Created");
            const yearString = year==1 ? "ère":"ème";
            const addSessionDto= {
              date: args.data[0].StartTime,
              endTime : args.data[0].EndTime,
              name: args.data[0].Subject}
            const getGroupDto= {
              sector: sector,
              level: year+yearString+" année",
              group: group
            }
            const dto = {
              addSessionDto: addSessionDto,
              getGroupDto: getGroupDto
            }
            //console.log("dto:", dto);
            // Post request to add the session to the database
            axios.post(`${baseURL}/${SESSION}/${ADD_SESSION}`, dto, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then(
              (response) => {
                console.log("response.data:", response.data);
                setReload(!reload);
              }).catch((err) => {
                console.log(err);
              });

        }
        if(args.requestType === "eventRemoved"){
          console.log((args.data[0]));
          axios.delete(`${baseURL}/${SESSION}/${args.data[0].id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(
            (response) => {
              console.log("response.data:", response.data);
              alert("removed");
              setReload(!reload);
            }).catch((err) => {
              console.log(err);
            });
        }
      }
        }
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" startHour="05:00" endHour="23:00" />
          <ViewDirective option="WorkWeek" startHour="08:00" endHour="18:00" isSelected={true}/>
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month]} />
      </ScheduleComponent>
      </div>
    );
  };
  
  export default AdminCalendar;
  