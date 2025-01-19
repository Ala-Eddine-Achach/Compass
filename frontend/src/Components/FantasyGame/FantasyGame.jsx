import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import "./FantasyGame.css";
import { baseURL } from "../../Api/Api";

// Add Axios interceptors for logging requests and responses
axios.interceptors.request.use(
    (config) => {
        console.log(`I'm the request to: ${config.url}`); // Log the request URL
        return config;
    },
    (error) => {
        console.error("Request error:", error); // Log request errors
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        console.log(`I'm the response from: ${response.config.url}`, response.data); // Log the response
        return response;
    },
    (error) => {
        console.error("Response error:", error); // Log response errors
        return Promise.reject(error);
    }
);

export default function FantasyGame() {
    const [subjects, setSubjects] = useState([]); // Available subjects
    const [selectedSubjects, setSelectedSubjects] = useState([]); // Selected lineup
    const maxSubjects = 5; // Max lineup size

    // Fetch available subjects and lineup on component mount
    useEffect(() => {
        const userToken = Cookie().get("compass"); // Get token from cookies

        // Fetch available subjects
        axios
            .get(`${baseURL}/fantasy/subjects`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                console.log("Response Data:", res.data); // Debugging
                if (Array.isArray(res.data)) {
                    // Add a default score to each subject
                    const subjectsWithScore = res.data.map(subject => ({
                        ...subject,
                        score: 0, // Default score
                    }));
                    setSubjects(subjectsWithScore);
                } else {
                    console.error("Invalid response format: Expected an array");
                }
            })
            .catch((err) => console.error("Error fetching subjects:", err));

        // Fetch selected lineup
        axios
            .get(`${baseURL}/fantasy`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                console.log("Fetched Lineup Data:", res.data); // Debugging
                if (Array.isArray(res.data)) {
                    // Filter out empty subjects (if needed)
                    const filteredLineup = res.data.filter(subject => subject.id !== -1);
                    setSelectedSubjects(filteredLineup);
                } else {
                    console.error("Invalid lineup format: Expected an array");
                }
            })
            .catch((err) => console.error("Error fetching lineup:", err));
    }, []);

    // Handle subject selection
    const handleSubjectSelection = (subject) => {
        // Ensure the selected subjects don't exceed the max count and avoid duplicates
        if (selectedSubjects.length < maxSubjects && !selectedSubjects.includes(subject)) {
            setSelectedSubjects([...selectedSubjects, subject]);
        }
    };

    // Remove a subject from the lineup
    const removeSubject = (subject) => {
        setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subject.id));
    };

    // Save the fantasy lineup
    const saveFantasyLineup = () => {
        const userToken = Cookie().get("compass"); // Get token from cookies

        // Construct lineup payload
        const lineupData = {
            subjects: selectedSubjects.map((subject) => ({
                id: subject.id,
                name: subject.name,
                score: subject.score,
            })),
        };

        // Send lineup to the backend
        axios
            .post(`${baseURL}/fantasy`,
                lineupData, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
            .then((res) => {
                alert("Fantasy lineup saved successfully!");
                console.log("Response:", res.data);
            })
            .catch((err) => console.error("Error saving lineup:", err));
    };

    return (
        <div className="fantasy-game-container">
            <h2>Choose Your Fantasy Lineup</h2>

            {/* Lineup Section */}
            <div className="lineup-container">
                {Array(maxSubjects)
                    .fill(null)
                    .map((_, index) => (
                        <div key={index} className="lineup-slot">
                            {selectedSubjects[index] ? (
                                <div className="subject-card">
                                    <h3>{selectedSubjects[index].name}</h3>
                                    <p>Score: {selectedSubjects[index].score}</p>
                                    <button onClick={() => removeSubject(selectedSubjects[index])}>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <p>Select a Subject</p>
                            )}
                        </div>
                    ))}
            </div>

            {/* Available Subjects */}
            <h3>Available Subjects</h3>
            <div className="available-subjects-container">
                {subjects.map((subject) => (
                    <div
                        key={subject.id}
                        className={`subject-item ${
                            selectedSubjects.includes(subject) ? "selected" : ""
                        }`}
                        onClick={() => handleSubjectSelection(subject)}
                    >
                        <h4>{subject.name}</h4>
                        <p>Score: {subject.score}</p>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <button
                onClick={saveFantasyLineup}
                disabled={selectedSubjects.length !== maxSubjects}
                className="save-button"
            >
                Save Lineup
            </button>
        </div>
    );
}