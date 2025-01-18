import {useState} from 'react';
import {MdOutlineAddPhotoAlternate} from "react-icons/md";
import {PiPaperPlaneTiltBold} from "react-icons/pi";
import "./MessageInput.css";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { MdOutlineEmojiEmotions } from "react-icons/md";


// eslint-disable-next-line react/prop-types
const MessageInput = (
    {
        handleSubmit,
        handleIconClick,
        prompt,
        setPrompt,
        fileInputRef,
        handleFileChange,
        handlePromptChange,
        selectedImage,
        fromChatBot,
        pickerUnderInput,
    }) => {
    const [showPicker, setShowPicker] = useState(false);
    const openClosePicker = ()=>{
        setShowPicker(!showPicker);
    }
    const onEmojiClick = (emojiObject)=>{
        const newPrompt = prompt + emojiObject.native;
        setPrompt(newPrompt);
        // openClosePicker();
    }
    const handleEmptyFile = () => {
        handleFileChange({target: {files: []}});
        fileInputRef.current.value = null;
    }

    const submitForm = (e) => {
        e.preventDefault();
        if(prompt.trim() !== ""){
            handleSubmit(e);
            setPrompt("");
            if(handleFileChange){
                handleEmptyFile();
            }
        }
    }

    return (
        <form className="prompt-form" onSubmit={handleSubmit}>
            {showPicker && <div className="emoji-picker">
                <Picker
                    set='apple'
                    onSelect={onEmojiClick}
                    title='Pick your emoji…'
                    emoji='point_up'
                    showPreview={false}
                    style={{
                        backgroundColor:'#FFFEFC',
                        width:'300px',
                        fontSize:'.8rem',
                        borderRadius:'20px',
                        padding:'10px',
                        position:'absolute',
                        bottom:pickerUnderInput ? '-570%':'115%',
                        right:'2%',
                        zIndex:'1',
                        boxShadow:'0 0 10px rgba(0,0,0,0.3)',
                    }}
                />
            </div>}
            <div className="container box-container d-flex flex-column mt-1">
                <div className="d-flex justify-content-between mt-1">
                                <textarea
                                    rows="1"
                                    placeholder={`${fromChatBot? 'Ask AcademIQa Bot ...' : 'Type a message ...'}`}
                                    value={prompt}
                                    onChange={handlePromptChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            submitForm(e);
                                        }
                                    }}
                                />

                        <div className=" d-flex justify-content-end">
                            {fromChatBot ? (<div
                                    className="add-image p-2 formatting sendIconButton d-flex justify-content-center align-items-center">
                                    <MdOutlineAddPhotoAlternate size={27} onClick={handleIconClick}/>
                                    <input
                                        type="file"
                                        className="image-prompt"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                </div>)
                                :
                                    <div
                                        className=" p-2 formatting sendIconButton d-flex justify-content-center align-items-center">
                                        <MdOutlineEmojiEmotions size={27} onClick={openClosePicker}/>
                                    </div>
                            }
                            <div
                                className="send-prompt  p-0 formatting d-flex justify-content-center align-items-center">
                                <button type="submit" className="sendIconButton" >
                                    <PiPaperPlaneTiltBold size={26} />
                                </button>
                            </div>
                        </div>
                </div>
                {selectedImage && (
                    <div style={{position: 'relative', display: 'inline-block', width: "12%"}}>
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected Image"
                            style={{height: "auto", marginBottom: '5px', borderRadius: '10px'}}
                        />
                        <div className="remove-cercle" style={{position: 'absolute', top: '-7px', right: '-7px'}}
                             onClick={handleEmptyFile}>
                            <svg viewBox="0 0 512 512" height="17" width="17" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="256" cy="256" r="248" stroke="white" strokeWidth="16" fill="#4e4e4e"/>
                                <path
                                    d="M377.6 329.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                                    fill="white"
                                />
                            </svg>

                        </div>
                    </div>

                )}
            </div>
        </form>
    );
};

export default MessageInput;