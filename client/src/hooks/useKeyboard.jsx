import { useEffect } from "react";
import { useGame } from "../context/GameContext";

const BOARD_SIZE = 20;

/**
 * Custom hook untuk kontrol keyboard pemain
 */
export function useKeyboard() {
  const { gameState, playerId, move, isReady } = useGame();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mencegah default behavior untuk tombol arrow
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        
        // Proses gerakan hanya jika pemain siap
        if (!gameState || !playerId || !isReady) return;
        
        const player = gameState.players[playerId];
        if (!player || !player.alive) return;
        
        let { x, y } = player.position;
        
        // Tentukan arah gerakan
        if (e.key === "ArrowUp" && y > 0) y--;
        else if (e.key === "ArrowDown" && y < BOARD_SIZE - 1) y++;
        else if (e.key === "ArrowLeft" && x > 0) x--;
        else if (e.key === "ArrowRight" && x < BOARD_SIZE - 1) x++;
        else return; // Tidak ada tombol arah yang valid
        
        // Kirim gerakan ke server
        move({ x, y });
      }
    };
    
    // Tambahkan event listener
    window.addEventListener("keydown", handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState, playerId, move, isReady]);
}