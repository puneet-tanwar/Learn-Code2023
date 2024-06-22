import { Socket } from "socket.io-client";
interface CustomSocket extends Socket {
    currentUserRole: String;
    currentUserId: Number;
  }