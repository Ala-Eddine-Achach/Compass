import { useState, useEffect, useContext } from "react";
import PopUp from "../../Common/PopUp/PopUp";
import axios from "axios";
import Cookie from "cookie-universal";
import { BiBookReader } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import "../AddNote/AddNote.css";
import { NoteContext } from "../../../Context/NoteContext";
import { baseURL, NOTE } from "../../../Api/Api";

const EditNote = ({ note, isOpen, setIsOpen }) => {
  const [editedNote, setEditedNote] = useState(note);
  const { updateNote, deleteNote } = useContext(NoteContext);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleInputChange = (event) => {
    setEditedNote({ ...editedNote, [event.target.name]: event.target.value });
  };

  const cookie = Cookie();
  const userToken = cookie.get("academiqa");
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log("editedNote: ", editedNote); // Log the edited note
    axios
      .patch(`${baseURL}/${NOTE}/${note.id}`, editedNote, config)
      .then((res) => {
        // console.log("patch: ", res); // Log the response
        updateNote(res.data);
        setIsOpen(false);
      })
      .catch((err) => {
        console.error(`${err} - Failed to update note`);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${baseURL}/${NOTE}/${note.id}`, config)
      .then((res) => {
        //console.log("delete: ", res); // Log the response
        deleteNote(res.data.id);
        setIsOpen(false);
      })
      .catch((err) => {
        console.error(`${err} - Failed to delete note`);
      });
  };

  const backgroundColor = "#FFFEFB";
  return (
    <PopUp
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="500px"
      backgroundColor={backgroundColor}
    >
      <div className="mt-2">
        {/* <div className="titlePopUp ml-12 d-flex flex-column">
          <h1 className="fw-bold">Edit Note</h1>
        </div> */}
        <div className="noteInfo mt-1">
          <div className="noteSubjectTypePopUp ml-3">
            <div className="pt-1 pl-1">
              <BiBookReader size={17} fill="black" />
            </div>
            <div className="noteST pt-1 pl-2 pr-1 ">
              <div className="s ">{note.session?.name}</div>
              <div className="t ">{note.session?.sessionType?.type}</div>
            </div>
          </div>
          <div className="noteDateTime">
            <div className="noteDatePopUp">
              {new Date(note?.session?.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="noteSessionTimePopUp">
              <FiClock size={15} stroke="black" />
              <div>{`${note?.session?.sessionType?.startHour
                .split(":")
                .slice(0, 2)
                .join(":")} - ${note?.session?.sessionType?.endHour
                .split(":")
                .slice(0, 2)
                .join(":")}`}</div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="noteContentPopUp mb-0">
          <div className="title-input">
            <HiOutlinePencilSquare size={25} />
            <input
              type="text"
              name="title"
              value={editedNote.title}
              onChange={handleInputChange}
              placeholder="Type your note's title ..."
            />
          </div>
          <hr className="addNoteHr" />
          <textarea
            name="content"
            value={editedNote.content}
            onChange={handleInputChange}
            placeholder="Type your note here ..."
            className="content-input"
          />
          <div className="flex">
            <button type="submit" className="addNote">
              Save
            </button>
            <button onClick={handleDelete} className="addNote">
              Delete
            </button>
          </div>
        </form>
      </div>
    </PopUp>
  );
};
export default EditNote;
