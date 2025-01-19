import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FantasyGame.css";

export default function FantasyGame() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const maxSubjects = 5;

    useEffect(() => {
        // Fetch available subjects from API
        axios
            .get("/{API_URL}/fantasy")
            .then((res) => setSubjects(res.data))
            .catch((err) => console.error("Error fetching subjects:", err));
    }, []);

    const handleSubjectSelection = (subject) => {
        if (selectedSubjects.length < maxSubjects && !selectedSubjects.includes(subject)) {
            setSelectedSubjects([...selectedSubjects, subject]);
        }
    };

    const removeSubject = (subject) => {
        setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subject.id));
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
        </div>
    );
}