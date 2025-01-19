import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { baseURL } from "../../Api/Api";
import "./Leaderboard.css";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const userToken = Cookie().get("compass"); // Get token from cookies
                const response = await axios.get(`/${baseURL}/student/leaderboard`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                // Ensure the response is an array
                if (Array.isArray(response.data)) {
                    setLeaderboard(response.data);
                } else {
                    console.error("Invalid API response: Expected an array, got", response.data);
                    setLeaderboard([]); // Set to empty array to avoid errors
                }
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
                setLeaderboard([]); // Set to empty array in case of error
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Total Points</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((student, index) => (
                    <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.username}</td>
                        <td>{student.totalPoints}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}