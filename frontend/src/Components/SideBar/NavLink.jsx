import {
    faHouse,
    faBookOpenReader,
    faComments,
    faNoteSticky,
    faCalendarDays,
    faChartLine, faChalkboardUser, faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'

export const links = [
    {
        name: "Home",
        path: "student/home",
        icon: faHouse,
        role: 'student',
    },
    {
        name: "Home",
        path: "teacher/home",
        icon: faHouse,
        role: 'teacher'
    },
    {
        name: "My Courses",
        path: "/student/courses",
        icon: faBookOpenReader,
        role: 'student'
    },
    {
      name: "My Courses",
        path: "teacher/profile",
        icon: faBookOpenReader,
        role: 'teacher'
    },
    {
        name: "My Notes",
        path: "/student/notes",
        icon: faNoteSticky,
        role: 'student'
    },
    {
        name: "My Calendar",
        path: "student/calendar",
        icon: faCalendarDays,
        role: 'student'
    },
    {
        name: "My Calendar",
        path: "teacher/calendar",
        icon: faCalendarDays,
        role: 'teacher'
    },
    {
        name: "See More Courses",
        path: "student/recommend",
        icon: "",
        image: "../../public/BotIcon.png",
        role: 'student'
    },
    {
        name: "Dashboards",
        path: "admin/home",
        icon: faChartLine,
        role: 'admin',
    },
    {
        name: "Teachers",
        icon: faChalkboardUser,
        path: "admin/professors",
        role: 'admin',
    },
    {
        name: "Students",
        path: "admin/students",
        icon: faGraduationCap,
        role: 'admin',
    },
    {
        name: "Calendar",
        path: "admin/calendar",
        icon: faCalendarDays,
        role: 'admin',
    },
    {
        name: "Manage Courses",
        path: "admin/courses",
        icon: faBookOpenReader,
        role: 'admin',
    },

]