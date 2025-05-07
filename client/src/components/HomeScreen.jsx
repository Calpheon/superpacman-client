import React, { useState } from "react";
import { useGame } from "../context/GameContext";


function HomeScreen() {
  const [name, setName] = useState("");
  const { joinGame } = useGame();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      joinGame(name.trim());
    }
  };
  

  const pacmanStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#FFCC00", 
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%)',
    animation: 'chomp 0.3s infinite',
    margin: "20px auto"
  };
  

  const dotStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#FFCC00",
    display: "inline-block",
    margin: "0 10px"
  };

  return (
    <div className="home-screen" style={{ 
      textAlign: "center", 
      padding: "40px",
      maxWidth: "600px", 
      margin: "0 auto",
      backgroundColor: "rgba(0,0,0,0.8)",
      border: "8px solid #2121DE",
      boxShadow: "0 0 20px rgba(33, 33, 222, 0.8)"
    }}>
      <h1 style={{ 
        color: "#FFCC00", 
        fontSize: "3rem",
        textShadow: "4px 4px 0px #2121DE",
        letterSpacing: "5px"
      }}>
        SUPER<br/>PACMAN
      </h1>
      

      <div style={pacmanStyle}></div>
      
      <div style={{ margin: "20px 0" }}>
        <span style={dotStyle}></span>
        <span style={dotStyle}></span>
        <span style={dotStyle}></span>
      </div>
      
      <p style={{ color: "#00FFFF", marginBottom: "30px" }}>
        POWERED BY GEMINI AI
      </p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ENTER NAME"
          required
          style={{
            width: "60%",
            textAlign: "center",
            marginBottom: "20px"
          }}
        />
        <br />
        <button
          type="submit"
          className="pacman-button"
        >
          JOIN GAME
        </button>
      </form>
      
      <div className="instructions" style={{ marginTop: "50px", textAlign: "left" }}>
        <h2 style={{ color: "#FFCC00", borderBottom: "2px solid #2121DE", paddingBottom: "5px" }}>
          HOW TO PLAY
        </h2>
        <ul style={{ color: "#FFFFFF", fontSize: "0.8rem", lineHeight: "2" }}>
          <li>USE ARROW KEYS TO MOVE YOUR PACMAN</li>
          <li>EAT ALL DOTS ON THE BOARD</li>
          <li>AVOID THE GHOSTS</li>
          <li>EACH TIME YOU CLEAR THE BOARD, A NEW GHOST APPEARS!</li>
        </ul>
      </div>
    </div>
  );
}

export default HomeScreen;