import { createContext, useContext, useState, useEffect } from "react";
import socket from "../services/socket";

// Buat context untuk game
const GameContext = createContext();

// Provider untuk membungkus aplikasi
export function GameProvider({ children }) {
  // State dasar untuk game
  const [gameState, setGameState] = useState({ players: {}, ghosts: [], points: [] });
  const [playerId, setPlayerId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [leaderboardHistory, setLeaderboardHistory] = useState([]);
  const [ghostCount, setGhostCount] = useState(1);

  useEffect(() => {
    // Update game state dari server
    socket.on('updateGameState', (newState) => {
      setGameState(newState);
      
      // Update jumlah hantu jika berubah
      if (newState.ghosts && newState.ghosts.length !== ghostCount) {
        setGhostCount(newState.ghosts.length);
        console.log(`Ghost count updated: ${newState.ghosts.length}`);
      }
      
      // Cek jika pemain kehabisan nyawa
      if (playerId && newState.players && newState.players[playerId] && 
          !newState.players[playerId].alive) {
        console.log("Player died - returning to home screen");
        exitGame();
      }
    });
    
    // Handler untuk status ready player
    socket.on('playerReady', (readyStatus) => {
      console.log("Received playerReady event from server:", readyStatus);
      setIsReady(readyStatus);
    });
    
    // Handler untuk history leaderboard
    socket.on('leaderboardHistory', (history) => {
      setLeaderboardHistory(history);
    });
    
    // Handler untuk koneksi socket
    socket.on('connect', () => {
      console.log("Socket connected!");
    });
    
    socket.on('disconnect', () => {
      console.log("Socket disconnected!");
    });
    
    // Cleanup saat component unmount
    return () => {
      socket.off('updateGameState');
      socket.off('playerReady');
      socket.off('leaderboardHistory');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [playerId, ghostCount]);

  // Fungsi untuk bergabung ke game
  const joinGame = (name) => {
    setPlayerId(socket.id);
    socket.emit('joinGame', { name });
  };

  // Fungsi untuk menggerakkan pemain
  const move = (position) => {
    if (isReady) {
      socket.emit('move', { position });
    }
  };

  // Fungsi untuk set pemain siap
  const setPlayerReady = () => {
    console.log("Sending playerReady event to server");
    socket.emit('playerReady');
    setIsReady(true);
  };

  // Fungsi untuk restart game
  const restartGame = () => {
    socket.emit('restartGame');
    setIsReady(false);
  };

  // Fungsi untuk keluar dari game
  const exitGame = () => {
    socket.disconnect();
    setPlayerId(null);
    setIsReady(false);
    setGhostCount(1);
    window.location.reload();
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      playerId, 
      joinGame, 
      move,
      isReady,
      setPlayerReady,
      ghostCount,
      restartGame,
      exitGame,
      leaderboardHistory
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook untuk menggunakan game context
export function useGame() {
  return useContext(GameContext);
}