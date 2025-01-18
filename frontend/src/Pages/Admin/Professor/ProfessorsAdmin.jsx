import Header from "../../../Components/admin/header/header.jsx";
import TableTeachers from "../../../Components/admin/teachersTable/TableTeachers.jsx";
import {Button} from "reactstrap";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import React, {useEffect, useState} from "react";
import axios from "axios";

const ProfessorsAdmin = () => {
    return (
        <>
            <Header/>
            <div>
                <TableTeachers role={"teacher"}/>
            </div>
        </>
    );
};

export default ProfessorsAdmin;