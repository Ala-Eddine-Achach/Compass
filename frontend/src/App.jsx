import "./App.css";
import { Route, Routes } from "react-router-dom";
import RequireRole from "./Pages/Auth/RequireRole.jsx";
import HomeStudent from "./Pages/Student/HomeStudent/HomeStudent.jsx";
import Notes from "./Pages/Student/Notes/Notes.jsx";
import ProfileStudent from "./Pages/Student/Profile/ProfileStudent.jsx";
import SessionStudent from "./Pages/Student/Session/SessionStudent.jsx";
import HomeTeacher from "./Pages/Teacher/HomeTeacher/HomeTeacher.jsx";
import ProfileTeacher from "./Pages/Teacher/Profile/ProfileTeacher.jsx";
import SessionTeacher from "./Pages/Teacher/Session/SessionTeacher.jsx";
import Course from "./Pages/Common/Course/Course.jsx";
import Courses from "./Pages/Student/Courses/Courses.jsx";
import Layout from "./Layouts/Layout.jsx";
import CalendarAdmin from "./Pages/Admin/Calendar/CalendarAdmin.jsx";
import TeacherCalendar from "./Pages/Teacher/TeacherCalendar.jsx";
import StudentCalendar from "./Pages/Student/StudentCalendar.jsx";
import Attendance from "./Pages/Teacher/Attendance.jsx";
import { NoteProvider } from "./Context/NoteContext.jsx";
import PageNotFound from "./Pages/Auth/PageNotFound.jsx";
import RequireLogin from "./Pages/Auth/RequireLogin.jsx";
import WebcamCapture from "./Components/FaceRecognition/WebcamCapture.jsx";
import HomeAdmin from "./Pages/Admin/Home/HomeAdmin.jsx";
import ProfessorsAdmin from "./Pages/Admin/Professor/ProfessorsAdmin.jsx";
import StudentsAdmin from "./Pages/Admin/Student/StudentsAdmin.jsx";
import CoursesAdmin from "./Pages/Admin/Course/CoursesAdmin.jsx";
import Profile from "./Pages/Admin/Profile/profile.jsx";

import { useParams } from "react-router-dom";
import FantasyGame from "./Components/FantasyGame/FantasyGame.jsx";
import Leaderboard from "./Components/leaderboard/Leaderboard.jsx";

export default function App() {
  const NoteProviderWrapper = () => {
    const { id } = useParams(); // Get the session id from the path

    return (
        <NoteProvider sessionId={id}>
          <SessionStudent />
        </NoteProvider>
    );
  };

  return (
      <>
        <Routes>
          <Route path="/login" element={<RequireLogin />} />
          <Route path="/face-recognition" element={<WebcamCapture />} />
          <Route element={<RequireLogin />}>
            <Route element={<Layout />}>
              <Route element={<RequireRole allowedRole={["student"]} />}>
                <Route path="/student/chat" element={<SessionStudent />} />
                <Route
                    path="/student/home"
                    element={
                      <NoteProvider>
                        <HomeStudent />
                      </NoteProvider>
                    }
                />
                <Route path="student/courses" element={<Courses />} />
                <Route
                    path="student/notes"
                    element={
                      <NoteProvider>
                        <Notes />
                      </NoteProvider>
                    }
                />
                <Route path="student/profile" element={<ProfileStudent />} />
                <Route
                    path="student/session/:id"
                    element={<NoteProviderWrapper />}
                />
                <Route path="student/calendar" element={<StudentCalendar />} />

                {/* Fantasy Game Routes */}
                <Route path="/fantasy" element={<FantasyGame />} />

                <Route path="/leaderboard" element={<Leaderboard />} />

              </Route>
              <Route element={<RequireRole allowedRole={["teacher"]} />}>
                <Route path="/teacher/home" element={<HomeTeacher />} />
                <Route path="teacher/profile" element={<ProfileTeacher />} />
                <Route path="teacher/session/:id" element={<SessionTeacher />} />
                <Route
                    path="teacher/session/:id/attendance"
                    element={<Attendance />}
                />
                <Route
                    path="teacher/calendar/:id?"
                    element={<TeacherCalendar />}
                />
              </Route>
              <Route
                  element={<RequireRole allowedRole={["student", "teacher"]} />}
              >
                <Route path="/course/:id" element={<Course />} />
              </Route>
              <Route element={<RequireRole allowedRole={["admin"]} />}>
                <Route path="admin/home" element={<HomeAdmin />} />
                <Route
                    path="admin/professors"
                    element={<ProfessorsAdmin />}
                />
                <Route path="admin/students" element={<StudentsAdmin />} />
                <Route
                    path="admin/calendar/:id?"
                    element={<CalendarAdmin />}
                />
                <Route path="admin/courses" element={<CoursesAdmin />} />
                <Route
                    path="admin/profile/:id/:role"
                    element={<Profile />}
                />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>
      </>
  );
}