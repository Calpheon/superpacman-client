import React from "react";
import { useGame } from "../context/GameContext";


function Leaderboard() {
  const { gameState, leaderboardHistory } = useGame();
  

  const currentLeaderboard = Object.values(gameState?.players || {})
    .filter(player => player)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  return (
    <div className="leaderboard-container">
      <div className="current-leaderboard">
        <h3 style={{ 
          color: "#FFCC00", 
          textAlign: "center", 
          marginTop: "0",
          fontSize: "1.2rem", 
          borderBottom: "2px solid #2121DE",
          paddingBottom: "10px"
        }}>
          HIGH SCORES
        </h3>
        
        {currentLeaderboard.length > 0 ? (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>NAME</th>
                <th>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaderboard.map((player, index) => (
                <tr key={`current-${index}`}>
                  <td style={{ color: index === 0 ? "#FFCC00" : "white" }}>{index + 1}</td>
                  <td style={{ color: index === 0 ? "#FFCC00" : "white" }}>{player.name}</td>
                  <td style={{ color: index === 0 ? "#FFCC00" : "white" }}>{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "#00FFFF" }}>NO PLAYERS YET</p>
        )}
      </div>
      
      <div className="historical-leaderboard" style={{ marginTop: "20px" }}>
        <h3 style={{ 
          color: "#00FFFF", 
          textAlign: "center",
          fontSize: "1rem", 
          borderBottom: "2px solid #2121DE",
          paddingBottom: "10px"
        }}>
          ALL-TIME BEST
        </h3>
        
        {leaderboardHistory.length > 0 ? (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>NAME</th>
                <th>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardHistory.map((entry, index) => (
                <tr key={`history-${index}`}>
                  <td style={{ color: index === 0 ? "#FFCC00" : "white" }}>{index + 1}</td>
                  <td style={{ color: index === 0 ? "#FFCC00" : "white" }}>{entry.name}</td>
                  <td style={{ color: index === 0 ? "#FFCC00" : "white" }}>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "#00FFFF" }}>NO RECORDS YET</p>
        )}
      </div>
      
      <div style={{ 
        marginTop: "20px", 
        padding: "10px", 
        border: "2px dashed #2121DE",
        backgroundColor: "rgba(33, 33, 222, 0.1)",
        fontSize: "0.7rem",
        textAlign: "center"
      }}>
        <div style={{ color: "#FFCC00" }}>CONTROLS</div>
        <div style={{ marginTop: "5px", color: "#FFFFFF" }}>
          [↑] [↓] [←] [→]
        </div>
        <div style={{ marginTop: "5px", fontSize: "0.6rem" }}>
          MOVE YOUR PACMAN
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;