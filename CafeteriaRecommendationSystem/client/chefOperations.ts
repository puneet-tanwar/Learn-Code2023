import { CustomSocket } from "./types/customSocket";
import readline from "readline";

export function rollOutNewMenu(socket: CustomSocket, rl: readline.Interface) {
  console.log("Chef operation: Roll Out New Menu");
}

export function generateMonthlyReport(
  socket: CustomSocket,
  rl: readline.Interface
) {
  console.log("Chef operation: Generate Monthly Report");
}

export function viewFeedbacks(socket: CustomSocket, rl: readline.Interface) {
  console.log("Chef operation: View Feedbacks");
}

export function viewReport(socket: CustomSocket, rl: readline.Interface) {
  console.log("Chef operation: View Report");
}
