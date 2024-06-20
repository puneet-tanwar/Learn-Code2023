import { CustomSocket } from "./types/customSocket";
import readline from "readline";

export function viewMenu(socket: CustomSocket, rl: readline.Interface) {
  console.log("Employee operation: View Menu");
}

export function addFeedback(socket: CustomSocket, rl: readline.Interface) {
  console.log("Employee operation: Add Feedback");
}

export function viewMyFeedbacks(socket: CustomSocket, rl: readline.Interface) {
  console.log("Employee operation: View My Feedbacks");
}

export function viewMonthlyReport(
  socket: CustomSocket,
  rl: readline.Interface
) {
  console.log("Employee operation: View Monthly Report");
}
