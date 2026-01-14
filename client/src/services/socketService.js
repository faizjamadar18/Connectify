import { io } from 'socket.io-client';
const socket = io('https://connectify-lzvt.onrender.com');

export { socket };