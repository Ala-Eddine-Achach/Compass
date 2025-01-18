import React, { useEffect, useRef, useState, useContext } from "react";
import notesData from "../Notes/noteData.json";
import Note from "../../../Components/Note/Note";
import MidNavbar from "../../../Components/MidNavbar/MidNavbar";
import Filter from "./Filter/Filter";
import Pagination from "../../../Components/Common/Pagination/Pagination";
import BackToTop from "../../../Components/Common/BackToTop/BackToTop";
import DatePicker from "react-datepicker";
import { BiBookReader } from "react-icons/bi";
import { LuCalendar } from "react-icons/lu";
import { FaRegStickyNote } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./Notes.css";
import { useDate } from "../../../Context/DateContext.jsx";
import { NoteContext } from "../../../Context/NoteContext.jsx";
import { CurrentUser } from "../../../Context/CurrentUserContext.jsx";
import Cookie from "cookie-universal";
import axios from "axios";
import { SUBJECT, baseURL } from "../../../Api/Api.jsx";

export default function Notes() {
  const date = useDate();
  const { currentUser, user } = useContext(CurrentUser);
  const { notes } = useContext(NoteContext);
  const [modulo, setModulo] = useState(4);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 860);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [paginationUsed, setPaginationUsed] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const colors = [
    "192, 222, 189", // green
    "198, 206, 235", // blue
    "230, 235, 198", // light yellow
    "179, 159, 209", // purple
    "228, 235, 188", // light green
    "237, 203, 199", // light pink
    "247, 226, 224", // pink
    "246, 232, 214", // light orange
  ];

  useEffect(() => {
    const userToken = Cookie().get("academiqa");
    const param = user?.group?.sectorLevel;
    //console.log("param: ", param);
    axios
      .get(`${baseURL}/${SUBJECT}/SectorLevel/${param}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setSubjects(res.data);

        //console.log("subjects: ", res.data);
      })
      .catch((err) => {
        console.error("Error: ", err); // Log the error
        console.error(`${err} - Failed to find subjects`);
      });
  }, [currentUser, user]);

  useEffect(() => {
    const filterNotes = (notes, selectedDate, selectedSubject) => {
      if (!selectedDate && !selectedSubject) {
        return notes;
      }
      return notes.filter(
        (note) =>
          (!selectedDate ||
            new Date(note?.session?.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) ===
              selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })) &&
          (!selectedSubject || note.session.name === selectedSubject)
      );
    };

    setFilteredNotes(filterNotes(notes, selectedDate, selectedSubject));
  }, [notes, selectedDate, selectedSubject]);

  useEffect(() => {
    const handleResize = () => {
      setModulo(
        window.innerWidth < 799
          ? 1
          : window.innerWidth < 1024
          ? 2
          : window.innerWidth < 1369
          ? 3
          : 4
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 860);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bottomRef = useRef();
  // useEffect(() => {
  //   bottomRef.current.scrollIntoView({ behavior: "instant" });
  // }, [currentPage]);

  useEffect(() => {
    if (paginationUsed) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
      setPaginationUsed(false); // Reset the flag
    }
  }, [currentPage, paginationUsed]);

  const getUniqueSubjects = () => {
    const uniqueSubjectNames = [
      ...new Set(subjects.map((subject) => subject.name)),
    ];
    // const subjects = new Set(notes.map((note) => note.session.subject));
    return Array.from(uniqueSubjectNames);
  };

  return (
    <div className="container notes-page pt-3">
      <MidNavbar />
      <div className="date ms-3">{date}</div>
      <div
        className={`my-notes d-flex mt-4 ms-3 p-3 ${
          isSmallScreen ? "more-margin" : ""
        }`}
      >
        <div className="notes-icon">
          <FaRegStickyNote size={40} />
        </div>
        <h1 className="fs-1 ms-2 fw-bold">My Notes</h1>
      </div>
      <div className="buttonContainer">
        <Filter
          Icon={LuCalendar}
          title="Date"
          className="buttonFilterD"
          dropdownClassName="DateFilter"
          onClear={() => {
            setSelectedDate(null);
            setCurrentPage(1);
          }}
          isFilterApplied={!!selectedDate}
          isClearButtonDisabled={!selectedDate}
        >
          {() => (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1);
              }}
              dateFormat="dd MMMM yyyy, EEEE"
              isClearable
              placeholderText="Select a date"
            />
          )}
        </Filter>
        <Filter
          Icon={BiBookReader}
          title="Subject"
          className="buttonFilterS"
          dropdownClassName="SubjectFilter"
          onClear={() => {
            setSelectedSubject(null);
            setCurrentPage(1);
          }}
          isFilterApplied={!!selectedSubject}
          isClearButtonDisabled={!selectedSubject}
        >
          {() =>
            getUniqueSubjects().map((subject) => (
              <a
                key={subject}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSubject(subject);
                  setCurrentPage(1);
                }}
              >
                {subject}
              </a>
            ))
          }
        </Filter>
      </div>
      <div className="container all-notes mt-1">
        <div ref={bottomRef} className="row d-flex justify-content-center">
          {filteredNotes.length > 0 ? (
            <>
              {filteredNotes
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((note, index) => (
                  <React.Fragment key={index}>
                    {index % modulo === 0 && index !== 0 && (
                      <hr style={{ width: "95%" }} />
                    )}
                    <div className="custom-col-c mt-4 mb-4 d-flex flex-column justify-content-center align-items-center">
                      <Note
                        key={note.id}
                        note={note}
                        baseColor={colors[index % colors.length]}
                      />
                    </div>
                  </React.Fragment>
                ))}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={(page) => {
                    setCurrentPage(page);
                    setPaginationUsed(true);
                  }}
                  pageNumbers={pageNumbers}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : (
            <div className="emptyNotes">No notes to display</div>
          )}
        </div>
        <BackToTop />
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
}
