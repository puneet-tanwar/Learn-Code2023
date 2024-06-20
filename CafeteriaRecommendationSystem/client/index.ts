import { io } from "socket.io-client";
import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { handleLoginSignup } from "./loginSignup";
import { promptUserOperations } from "./userOperations";

const socket = io("http://localhost:3000") as CustomSocket;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on("connect", () => {
  console.log("Connected to the server");
  handleLoginSignup(socket, rl, promptUserOperations);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
