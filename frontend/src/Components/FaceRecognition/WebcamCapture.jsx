import React,{useRef, useState, useEffect, useContext} from 'react';
import Webcam from 'react-webcam';
import StudentsList from "../StudentsList/StudentsList.jsx";
import {toast} from "react-toastify";
import {ToastContext} from "../../Context/ToastContext.jsx";
import Select from "react-select";

// eslint-disable-next-line react/prop-types
const WebcamCapture = ({sessionId,students,setStudents,setAbsentStudents,absentStudents}) => {
  const webcamRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [WaitingForAnswer, setWaitingForAnswer] = useState(true);
  const {showToast} = useContext(ToastContext);
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8765');
    newSocket.onopen = async () => {
      console.log('WebSocket connected');
      console.log("Sending session id", sessionId)
      newSocket.send("S" + sessionId);
    };
    newSocket.onmessage = (event) => {
      console.log(event.data)
      if(event.data === "1"){
        newSocket.close();
      }else if( event.data === "2"){
        console.log("Error")
        showToast("Session not found", 'error')
      }else if(event.data === "3"){
        newSocket.send("S" + sessionId);
      } else if(event.data !== "0"){
        const data = JSON.parse(event.data);
          console.log("Student found", data)
          setStudents(prevStudents => [...prevStudents, {'id':data.id,'username': data.username, 'isPresent': true}]);
          setAbsentStudents(absentStudents.filter(s => s.id !== data?.id));
          setWaitingForAnswer(false);
      } else {
        setWaitingForAnswer(false);
      }
    };
    setSocket(newSocket);
    return()=>{
      newSocket.close();
    }
  }, []);

  useEffect(() => {
    const captureFrame = async () => {
      if(WaitingForAnswer===false){
      const imageSrc = webcamRef.current.getScreenshot();
      const test = imageSrc;
    try {
      socket.send(test);
      console.log('Image sent to server.');
      setWaitingForAnswer(true);
    } catch (error) {
      console.error('Error sending image to server:', error);
      socket.close();
      return;
    }
  }
   };

   const intervalId = setInterval(captureFrame, 33);

   return () => clearInterval(intervalId);
  }, [socket, WaitingForAnswer]);
  const [deviceOptions, setdeviceOptions] = useState();
  const [selectedDevice, setSelectedDevice] = useState();
  const handleDevices = React.useCallback(
      mediaDevices =>{
        const devices = mediaDevices.filter(({ kind }) => kind === "videoinput");
        const options = devices.map(device => ({ ["value"]: device.deviceId, ["label"]:device.label }));
        console.log(options);
        setdeviceOptions(options)
        setSelectedDevice({deviceId:options[0].value})
        console.log(devices);
      },
      []
  );

  React.useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices]
  );
  return (
    <div className="d-flex justify-content-start">
      <Webcam forceScreenshotSourceSize={true} mirrored={true} style={{width:"70%", height:"100%"}} audio={false} ref={webcamRef} screenshotFormat="image/jpeg"/>
      <div style={{width:"30%"}} className="mt-12 mx-3">
        <Select className="mb-2" options={deviceOptions} onChange={
          (e)=>{
            setSelectedDevice({deviceId:e.value});
            console.log(selectedDevice);
          }
        }></Select>
        <StudentsList presence={true} group={students}/>
      </div>
    </div>
  );

};

export default WebcamCapture;
