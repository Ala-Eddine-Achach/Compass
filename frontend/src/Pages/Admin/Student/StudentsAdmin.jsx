import React, {useContext, useEffect, useState} from 'react';
import Header from "../../../Components/admin/header/header.jsx";
import TableStudents from "../../../Components/admin/StudentsTable/TableStudents.jsx";
import axios from "axios";
import {Button} from "reactstrap";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import Cookie from "cookie-universal";
import {ToastContext} from "../../../Context/ToastContext.jsx";

const StudentsAdmin = () => {
    const [groups, setGroups] = useState([]);
    const [fileGroup, setFileGroup] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const {showToast} = useContext(ToastContext);
    useEffect(() => {
        getGroups();
    }, []);
    const cookie = Cookie();
    const userToken = cookie.get('academiqa')
    const handleGroupFileCLick = () => {
        document.getElementById('csv-upload-group').click();
    }

    const [groupDone, setGroupDone] = useState(false);
    const handleGroupFileChange = (e) => {
        console.log(e.target)
        setFileGroup(e.target.files[0]);
        setGroupDone(true);
    }
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
        },
    };
    const handleGroupSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', fileGroup);
        axios.post('http://localhost:5000/group/CreateAll', formData, config).then(r => {
            console.log(r)
            getGroups();
            showToast('Groups imported successfully', 'success');
            setGroupDone(false);
            setFileGroup(null);
            document.getElementById('csv-upload-group').value = null;
        }).catch(e => {
            console.log(e)
            setGroupDone(false);
            setFileGroup(null);
            document.getElementById('csv-upload-group').value = null;
        })
    }
    const getGroups = () => {
        axios.get('http://localhost:5000/group',{
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then(r => {
            console.log(r)
            setGroups(r.data);
        }).catch(e => {
            console.log(e)
        })
    }


    return (
        <>
            <Header/>
            <div className="d-flex align-items-start flex-column" style={{marginTop:'-7%'}}>
                <div className="ms-3 mb-3 px-5 d-flex AddEtudiant justify-content-end multiple-teachers">
                    <Button
                        onClick={handleGroupFileCLick}
                        className="addbtn"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered && !groupDone && (<span style={{fontSize: '14px'}}>
                                        Please upload a CSV file
                                    </span>)}
                        {!isHovered && !groupDone && (<span> Import groups data </span>)}
                        {groupDone && <span> {fileGroup.name} </span>}
                    </Button>
                    {groupDone && (
                        <div
                            className="transform transition-transform duration-300 hover:scale-110  d-flex align-items-center ms-1"
                            onClick={handleGroupSubmit}>
                            <IoMdCheckmarkCircleOutline fill={"#692E5F"} size={30} className="cursor-pointer"/>
                        </div>
                    )}
                    <input
                        type="file"
                        name="file"
                        className="image-prompt"
                        style={{display: "none"}}
                        accept=".csv"
                        id="csv-upload-group"
                        onChange={handleGroupFileChange}
                    />
                </div>
                <TableStudents groups={groups} />
            </div>
        </>
    );
};

export default StudentsAdmin;