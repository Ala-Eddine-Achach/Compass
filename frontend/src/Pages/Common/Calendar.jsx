import FirstCalendar from "../../Components/Calendar/FirstCalendar";

export default function Calendar(){
    return(
    <div style={{ width: '100%'}}>
        <div style={{ marginLeft: '30px', marginTop: '20px'}}>
            <h1 style={{fontFamily: "Inika"}}>
                Calendar
            </h1>
        <FirstCalendar />
        </div>
    </div>
    )
}