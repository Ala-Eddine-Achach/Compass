import "./Profile.css";
import { useContext, useEffect, useState } from "react";
import { LiaIdCard } from "react-icons/lia";
import { TbSchool } from "react-icons/tb";
import { MdAutoGraph } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { FaChalkboardUser } from "react-icons/fa6";
import { TbPhotoEdit } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { CurrentUser } from "../../Context/CurrentUserContext.jsx";
import axios from "axios";
import Cookie from "cookie-universal";
import avatar from "../../assets/images/avatar.png";
import { toast } from "react-toastify";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import ChangePassword from "../Auth/ChangePassword.jsx";

const Profile = () => {
  // use useState
  const { currentUser, user } = useContext(CurrentUser);
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [userphoto, setUserphoto] = useState(null);
  const [changePassword, setChangePassword] = useState(false); // State variable to track whether ChangePassword component is open

  // Function to toggle the state of changePassword
  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
  };
  useEffect(() => {
    setUserphoto(user?.photo || avatar);
  }, [user]);
  const handleFileCLick = () => {
    document.getElementById("image-upload").click();
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const newFileName = `${user?.id}.png`; // Assuming `user?.id` is the studentId
    const newFile = new File([selectedFile], newFileName, {
      type: selectedFile.type,
    });

    setFile(newFile);
    //console.log("fileee", newFile);

    setDone(true);

    // Update the displayed photo to show the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserphoto(event.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const userToken = Cookie().get("academiqa");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userToken}`,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      image: file,
    };

    // const formData = new FormData();
    // formData.append('photo', file);
    try {
      const res = await axios.patch(
        "http://localhost:5000/user/edit-photo",
        data,
        config
      );
      //console.log(res);
      setDone(false);
      setFile(null);
      document.getElementById("image-upload").value = null;
    } catch (error) {
      console.error("Error:", error);
      setDone(false);
      setFile(null);
      document.getElementById("image-upload").value = null;
      toast.error(`Error while updating your image`);
    }
  };

  const cancel = () => {
    setDone(false);
    setFile(null);
    setUserphoto(user?.photo || avatar);
    document.getElementById("image-upload").value = null;
  };
  return (
    <div className="profile-box flex flex-col justify-center p-4 pt-2 rounded-2xl sm:px-12 md:w-72 lg:w-96">
      <div
        className={`profile-teacher d-flex mt-3.5  p-2 px-3 ms-md-3 ms-sm-0 ${
          currentUser?.role === "Teacher" ? "mb-5" : "mb-10"
        }`}
      >
        <div className="courses-icon pt-1">
          <FaUser size={30} />
        </div>
        <h1 className="ms-2 fw-bold">Profile</h1>
      </div>
      <div className="flex mx-auto mb-4">
        <img src={userphoto} alt="photo" className="w-32 h-32 rounded-full" />
        {!done && (
          <button
            className="edit-photo-button relative"
            onClick={handleFileCLick}
          >
            <TbPhotoEdit className="min-h-6 min-w-6 absolute bottom-0.5" />
          </button>
        )}
        {done && (
          <div className="d-flex relative">
            <div
              onClick={handleSubmit}
              className="relative check-button-profile ms-1"
            >
              <IoMdCheckmarkCircleOutline
                size={23}
                className="d-flex align-items-center cursor-pointer min-h-6 absolute bottom-0.5"
              />
            </div>
            <ImCancelCircle
              onClick={cancel}
              size={20}
              className="check-button-profile absolute bottom-0.5 mb-0.5"
              style={{ left: "30px" }}
            />
          </div>
        )}
        <input
          type="file"
          name="file"
          className="image-prompt"
          style={{ display: "none" }}
          accept="image/png, image/jpeg, image/jpg"
          id="image-upload"
          onChange={handleFileChange}
        />
      </div>
      <div className=" text-center container pt-2">
        <div className="profile-name text-xl font-bold sm:text-2xl">
          {currentUser?.username}
        </div>

        {currentUser?.role === "Student" && (
          <div className="text-left ">
            <div className="profile-enrolment flex items-center w-full pb-2 rounded-3xl pl-4 pt-2 mt-4 text-sm">
              <LiaIdCard className="min-w-6 mr-2" size={25} />
              <div>
                <span className="font-bold">Enrolment Number :</span>{" "}
                {user?.enrollmentNumber}
              </div>
            </div>
            <div className="profile-info w-full pb-2.5 rounded-3xl pl-4 pr-0.5 pt-2.5 mt-4 text-sm">
              <div className="flex items-center m-1">
                <TbSchool className="min-w-6 mr-2" size={25} />
                <div>
                  <span className="font-bold">Sector :</span>{" "}
                  {user?.group?.sector}
                </div>
              </div>
              <div className="flex items-center m-1">
                <MdAutoGraph className="min-w-6 mr-2" size={25} />
                <div>
                  <span className="font-bold">Level :</span>{" "}
                  {user?.group?.level}
                </div>
              </div>
              <div className="flex items-center m-1">
                <MdGroups className="min-w-6 mr-2" size={25} />
                <div>
                  <span className="font-bold">Group :</span>{" "}
                  {user?.group?.group}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentUser?.role === "Teacher" && (
          <div className="text-left">
            <div className="profile-info w-full pb-2.5 rounded-3xl pl-4 pt-2.5 pr-2 mt-4 text-sm">
              <div className="flex items-center">
                <FaChalkboardUser className="min-w-6 mr-2" size={25} />
                <div>
                  <span className="font-bold">Speciality :</span>{" "}
                  {user?.speciality}
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          className="profile-cp flex items-center justify-between w-full h-10 rounded-3xl p-2 my-4 text-sm"
          onClick={toggleChangePassword} // Call toggleChangePassword function on button click
        >
          <div className="pl-3 font-bold">Change Password</div>
          <GoPencil className="min-w-6 mr-1" size={25} />
        </button>

        {/* Render the ChangePassword component if changePassword state is true */}
        {changePassword && (
          <ChangePassword
            isOpen={changePassword}
            setIsOpen={setChangePassword}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
