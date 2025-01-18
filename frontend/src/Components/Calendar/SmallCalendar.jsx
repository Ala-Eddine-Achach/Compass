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
  import "./smallCalendar.css";
  
  import { Internationalization } from "@syncfusion/ej2-base";
  import { useNavigate } from "react-router-dom";
  import { registerLicense } from '@syncfusion/ej2-base';
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cWWFCeEx1WmFZfVpgcl9GYVZSTGY/P1ZhSXxXdkBjXX5WcXRVT2RUVkc=');
  
  
  const SmallCalendar = ({role, sessions}) => {
    const nav = useNavigate();

    
    const instance = new Internationalization();
    const getTimeString = (value) => {
      return instance.formatDate(value, { skeleton: "hm" });
    };
    
    const typeOrGroup = sessions[0]?.sessionType?.group? "group": "type";
  
    const eventSettings = {
      dataSource: sessions,
      fields: {
        id: 'Id',
        subject: { name: 'Subject', title: 'Subject' },
        location: { name: typeOrGroup, title: `Session ${typeOrGroup=="group"?"Group":"Type"}` },
      },
    };

  
    return (
      <div>
        
      <ScheduleComponent
        height="340px"
        style={{borderRadius: '30px'}}
        // selectedDate={new Date(2018, 1, 14)}
        eventSettings={eventSettings}
        readOnly={true}
        popupOpen={(args) => {
          args.cancel = true;
        }}
        showQuickInfo={false}
        showHeaderBar={false}
      >
        <ViewsDirective>
          <ViewDirective option='Day' interval={3} displayName='3 Days'startHour="08:00" endHour="18:00" isSelected={true} />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month]} />
      </ScheduleComponent>
      </div>
    );
  };
  
  export default SmallCalendar;
  