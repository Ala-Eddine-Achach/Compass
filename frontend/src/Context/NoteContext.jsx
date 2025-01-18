import React, { useState, useEffect, useContext } from "react";
import { CurrentUser } from "./CurrentUserContext";
import Cookie from "cookie-universal";
import axios from "axios";
import { baseURL, NOTE } from "../Api/Api";

const NoteContext = React.createContext();

const NoteProvider = ({ children, sessionId }) => {
  const { currentUser } = useContext(CurrentUser);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (currentUser?.role === "Student") {
      const userToken = Cookie().get("academiqa");
      if (sessionId) {
        axios
          .get(`${baseURL}/${NOTE}/${sessionId}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setNotes(res.data);
            console.log("Notes of session: ", res.data);
          })
          .catch((err) => {
            console.error("Error: ", err); // Log the error
            console.error(`${err} - Failed to find notes`);
          });
      } else {
        axios
          .get(`${baseURL}/${NOTE}/`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setNotes(res.data);
            console.log("Notes: ", res.data);
          })
          .catch((err) => {
            console.error("Error: ", err); // Log the error
            console.error(`${err} - Failed to find notes`);
          });
      }
    }
  }, [currentUser, sessionId]);

  const addNote = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export { NoteContext, NoteProvider };
