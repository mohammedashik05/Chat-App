import { io } from "socket.io-client";

export const socket = io("http://localhost:7000", {
  autoConnect: false,  // ✅ wait until token is available
  auth: {
    token: localStorage.getItem("token")
  }
});
