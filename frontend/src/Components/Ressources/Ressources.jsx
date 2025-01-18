import "./Ressources.css";
import React, { useEffect, useState } from 'react';
import AddButton from "../Common/AddButton/AddButton.jsx";
import Scrollbar from "../Common/Scrollbar/Scrollbar.jsx";
import { FaRegFile } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";
import { RxDownload } from "react-icons/rx";
import noRessources from "../../assets/images/no-ressources.svg";
import DeleteButton from "../Common/DeleteButtonForResTask/DeleteButton.jsx";
import { baseURL, RESOURCE } from "../../Api/Api.jsx";
import Cookie from "cookie-universal";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import PopUp from "../Common/PopUp/PopUp.jsx";

function Ressources({ role, sessionId }) {
    const [files, setFiles] = useState([]);
    const userToken = Cookie().get('academiqa');
    const [uploading, setUploading] = useState(false); // State to track file upload status
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [fileToDelete, setFileToDelete] = useState(null); // State to store file to be deleted

    useEffect(() => {
        axios
            .get(`${baseURL}/${RESOURCE}/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                setFiles(res.data);
            })
            .catch((err) => {
                console.error(`${err} - Failed to fetch resources`);
            });
    }, [sessionId]);

    const handleFileSelect = async (file) => {
        setUploading(true); // Set uploading status to true when file is selected

        const formData = new FormData();
        formData.append('file', file);
        formData.append('session', sessionId);

        try {
            const response = await axios.post(`${baseURL}/${RESOURCE}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setFiles([...files, response.data]);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false); // Set uploading status to false after upload completes
        }
    };

    const handleLinkSelect = async (link) => {
        const newResource = { session: sessionId, type: 'link', link: link, fileUrl: '' };

        try {
            const response = await axios.post(`${baseURL}/${RESOURCE}/link`, newResource, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setFiles([...files, response.data]);
        } catch (error) {
            console.error('Error uploading link:', error);
        }
    };

    const handleDownload = (fileIndex) => {
        const file = files[fileIndex];
        if (file && file.type === 'file') {
            window.open(file.fileUrl, '_blank');
        } else if (file && file.type === 'link') {
            window.open(file.link, '_blank');
        }
    };

    const confirmDelete = (fileIndex) => {
        setFileToDelete(fileIndex);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        const file = files[fileToDelete];
        if (file && file.id) {
            try {
                await axios.delete(`${baseURL}/${RESOURCE}/${file.id}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                const newFiles = files.filter((_, index) => index !== fileToDelete);
                setFiles(newFiles);
            } catch (error) {
                console.error('Error deleting file:', error);
            } finally {
                setIsModalOpen(false);
                setFileToDelete(null);
            }
        } else {
            console.error('Invalid file ID');
        }
    };

    const extractFilename = (url) => {
        return url.split('/').pop().split('-').pop();
    };

    return (
        <div className="ressources-box h-[250px] ">
            <div className="ressources-title pl-4 pr-5 flex font-IstokWebRegular font-semibold ">
                <div className="overflow-hidden max-w-40 mr-2.5 mb-2" title="Ressources">
                    Ressources
                </div>
                {role === 'teacher' && (<AddButton onFileSelect={handleFileSelect} onLinkAdd={handleLinkSelect} />)}
            </div>
            <div className="ressources-content container ">
                <Scrollbar
                    trackColor="rgba(233, 177, 176, 0.25)"
                    thumbColor="rgba(233, 177, 176, 0.60)"
                    maxHeight="170px"
                >
                    {files.length === 0 && (
                        <div className="no-ressources max-h-52 w-1/2 mx-auto mt-10 ">
                            <img src={noRessources} alt="No ressources" />
                        </div>
                    )}
                    {files.map((file, index) => (
                        <div key={index}>
                            {file.type === 'link' ? (
                                <div className="ressources-file max-w-72 p-2 flex rounded-full mx-3.5 mb-3">
                                    <TbWorldWww className="file-icon grow-0 min-w-7 min-h-7 ml-3.5 mr-2" />
                                    <button
                                        className="text-left pt-1 font-IstokWebRegular grow max-h-7 max-w-[180px] truncate overflow-hidden text-ellipsis hover:font-semibold"
                                        title={file.link}
                                        onClick={() => handleDownload(index)}
                                    >
                                        {file.link}
                                    </button>
                                    {role === 'teacher' && (
                                        <button className="file-delete-button container max-w-4 " onClick={() => confirmDelete(index)}>
                                            <DeleteButton />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="ressources-file max-w-72 max-h-11 p-2 flex rounded-full mx-3.5 mb-2 ">
                                    <FaRegFile className="file-icon grow-0 min-w-7 min-h-7 ml-3.5 mr-2" />
                                    <button
                                        className="text-left pt-1 font-IstokWebRegular grow max-h-7 max-w-[180px] truncate overflow-hidden text-ellipsis hover:font-semibold"
                                        title={extractFilename(file.fileUrl)}
                                        onClick={() => handleDownload(index)}
                                    >
                                        {extractFilename(file.fileUrl)}
                                    </button>
                                    <button className="ressources-icon grow-0 container max-w-4" onClick={() => handleDownload(index)}>
                                        <RxDownload className="min-w-4 min-h-4 hover:scale-110 " />
                                    </button>
                                    {role === 'teacher' && (
                                        <button className="file-delete-button container max-w-4 " onClick={() => confirmDelete(index)}>
                                            <DeleteButton />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {uploading && (
                        <div className="uploading-spinner">
                            <ImSpinner2 className="spinner-icon" />
                        </div>
                    )}
                </Scrollbar>
            </div>

            {/* PopUp component for deletion confirmation */}
            <PopUp
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                width="400px"
                fromPresence={false}
                fromCourse={false}
            >
                <div className="popup-content-resources">
                    <p>Are you sure you want to delete this resource?</p>
                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </PopUp>
        </div>
    );
}

export default Ressources;
