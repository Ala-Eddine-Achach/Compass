import Header from "../../../Components/admin/header/header.jsx";
import TableCourses from "../../../Components/admin/CoursesTable/CoursesTable.jsx";

const CoursesAdmin = () => {
    return (
        <>
            <Header/>
            <div>
                <TableCourses/>
            </div>
        </>
    );
};

export default CoursesAdmin;