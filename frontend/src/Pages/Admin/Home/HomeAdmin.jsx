import React from 'react';
import Header from "../../../Components/admin/header/header.jsx";
import './home.css'
import AbsenceChart from "../../../Components/admin/AbsenceChart/AbsenceChart.jsx";
import AdminsTable from "../../../Components/admin/AdminsTable/AdminsTable.jsx";
import HeaderBg from "../../../Components/admin/header/HeaderBg.jsx";

const HomeAdmin = () => {
    return (<div className="admin-home-page">
        {/*<HeaderBg/>*/}
        <Header/>
        <div className="row w-full -mt-9">
            <div className="col-xl-8">
                <AbsenceChart/>
            </div>
            <div className="col-xl-4 xl:-mt-9">
                <AdminsTable/>
            </div>
        </div>
    </div>);
};

export default HomeAdmin;