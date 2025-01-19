import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { baseURL } from "../../Api/Api";
import "./Leaderboard.css";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const userToken = Cookie().get("compass"); // Get token from cookies

                // Ensure the URL is correctly formatted
                const apiUrl = `${baseURL}/student/leaderboard`.replace(/([^:]\/)\/+/g, "$1");

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                console.log("API Response:", response.data); // Debugging

                // Ensure the response is an array and contains valid data
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setLeaderboard(response.data);
                } else {
                    console.error("Invalid API response: Expected a non-empty array, got", response.data);
                    setLeaderboard([]); // Set to empty array to avoid errors
                }
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
                setError("Failed to fetch leaderboard data. Please try again later."); // Set error message
                setLeaderboard([]); // Set to empty array in case of error
            } finally {
                setLoading(false); // Set loading to false after the request completes
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>; // Show loading spinner
    }

    if (error) {
        return <div className="error">{error}</div>; // Show error message
    }

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            {leaderboard.length === 0 ? (
                <div className="empty-message">No data available.</div> // Show message if leaderboard is empty
            ) : (
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
            )}
        </div>
    );
}