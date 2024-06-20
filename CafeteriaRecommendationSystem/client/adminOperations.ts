import { CustomSocket } from "./types/customSocket";
import readline from "readline";

export function addUser(socket: CustomSocket, rl: readline.Interface) {
  console.log("Admin operation: Add User");
}

export function viewMenu(socket: CustomSocket, rl: readline.Interface) {
  console.log("Admin operation: View Menu");
}

export function updateMenuItem(socket: CustomSocket, rl: readline.Interface) {
  console.log("Admin operation: Update Menu Item");
}

export function addNewItem(socket: CustomSocket, rl: readline.Interface) {
  console.log("Admin operation: Add New Menu Item");
}

export function deleteItem(socket: CustomSocket, rl: readline.Interface) {
  console.log("Admin operation: Delete Menu Item");
}

export function viewMonthlyReport(
  socket: CustomSocket,
  rl: readline.Interface
) {
  console.log("Admin operation: View Monthly Report");
}

function handleAdminOperations(
  choice: string,
  socket: CustomSocket,
  rl: readline.Interface
) {
  switch (choice) {
    case "1":
      addUser(socket, rl);
      break;
    case "2":
      viewMenu(socket, rl);
      break;
    case "3":
      updateMenuItem(socket, rl);
      break;
    case "4":
      addNewItem(socket, rl);
      break;
    case "5":
      deleteItem(socket, rl);
      break;
    case "6":
      viewMonthlyReport(socket, rl);
      break;
    case "0":
      rl.close();
      socket.close();
      console.log("Goodbye!");
      break;
    default:
      console.log("Invalid choice, please try again.");

      break;
  }
}

export { handleAdminOperations };
