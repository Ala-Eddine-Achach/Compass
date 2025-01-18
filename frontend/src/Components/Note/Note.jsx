import "../Note/Note.css";
import { useState } from "react";
import EditNote from "../PopUpNote/EditNote/EditNote.jsx";

const Note = ({ maxWidth, note, baseColor }) => {
  const noteStyle = {
    backgroundColor: `rgba(${baseColor},0.36)`,
  };

  const noteFooterStyle = {
    backgroundColor: `rgb(${baseColor})`,
  };
  const [viewNote, setViewNote] = useState(false);
  const handleViewNote = () => {
    setViewNote(true);
  };
  return (
    <div
      className="note"
      style={{ ...noteStyle, maxWidth: maxWidth ? "280px" : "", width: "95%" }}
    >
      <div className="noteHeader">
        <div className="noteSubjectType">
          <div>{note?.session?.name}</div>
          <div>{note?.session?.sessionType?.type}</div>
        </div>
        <div className="noteDate">
          {new Date(note?.session?.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="titleDivNote cursor-pointer" onClick={handleViewNote}>
        <div className="titleNote">{note?.title}</div>
        <button className="editBtnNote">
          <svg height="1em" viewBox="0 0 512 512">
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
          </svg>
        </button>
      </div>
      <hr style={{ marginLeft: "25px", marginRight: "25px" }} />
      <div className="noteContent">{note?.content}</div>
      <div className="noteFooter" style={noteFooterStyle}>
        <div className="noteSessionTime">
          <svg className="clockIcon" viewBox="0 0 30 30" width="30" height="30">
            <line
              x1="5"
              y1="1"
              x2="25"
              y2="1"
              stroke="black"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <circle
              cx="15"
              cy="15"
              r="11"
              stroke="black"
              strokeWidth="2"
              fill="none"
            />{" "}
            <line
              x1="15"
              y1="4"
              x2="15"
              y2="7"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="26"
              y1="15"
              x2="23"
              y2="15"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="15"
              y1="26"
              x2="15"
              y2="23"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="15"
              x2="7"
              y2="15"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              className="hourHand"
              x1="15"
              y1="15"
              x2="15"
              y2="10"
              stroke="black"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <line
              className="minuteHand"
              x1="15"
              y1="15"
              x2="18"
              y2="15"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="29"
              x2="25"
              y2="29"
              stroke="black"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <div>{`${note?.session?.sessionType?.startHour
            .split(":")
            .slice(0, 2)
            .join(":")} - ${note?.session?.sessionType?.endHour
            .split(":")
            .slice(0, 2)
            .join(":")}`}</div>
        </div>
      </div>
      <EditNote note={note} isOpen={viewNote} setIsOpen={setViewNote} />
    </div>
  );
};

export default Note;
