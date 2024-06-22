import { SocketClient } from "./SocketClient";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socketClient = new SocketClient("http://localhost:3000", rl);
socketClient.connect();
