import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  transports: ['websocket', 'polling']
});

// Logging untuk debugging
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

export default socket;