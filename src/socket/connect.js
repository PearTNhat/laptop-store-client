import { io } from 'socket.io-client';
const ENDPOINT = import.meta.env.VITE_BASE_URL_SERVER;
// const ENDPOINT = 'http://localhost:5000';

console.log(import.meta.env.VITE_BASE_URL_SERVER)
let socket;
function connectSocket() {
    socket = io(ENDPOINT);
}
function disconnectSocket() {
    if (socket) {
      socket.disconnect();
    }
  }
export { socket, connectSocket,disconnectSocket };
