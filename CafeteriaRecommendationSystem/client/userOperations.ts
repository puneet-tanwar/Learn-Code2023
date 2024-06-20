import { CustomSocket } from "./types/customSocket";
import readline from "readline";

import {
  addUser,
  updateMenuItem,
  addNewItem,
  deleteItem,
} from "./adminOperations";
import { addFeedback, viewMyFeedbacks } from "./employeeOperations"; 
import {
  rollOutNewMenu,
  generateMonthlyReport,
  viewFeedbacks,
  viewReport,
} from "./chefOperations";

export function promptUserOperations(
  socket: CustomSocket,
  rl: readline.Interface
) {
  console.log({ socket });
  console.log("\nChoose an operation:");

  const role = socket.currentUserRole;

  if (role === "admin") {
    console.log("1. Create New User Account");
    console.log("2. View Menu");
    console.log("3. Update Menu Item");
    console.log("4. Add New Menu Item");
    console.log("5. Delete Menu Item");
    console.log("6. View Monthly Report");
  } else if (role === "chef") {
    console.log("1. View Menu");
    console.log("2. Roll Out New Menu");
    console.log("3. Generate Monthly Report");
    console.log("4. View Report");
    console.log("5. View Feedbacks");
  } else if (role === "employee") {
    console.log("1. View Menu");
    console.log("2. Add Feedback");
    console.log("3. View My Feedbacks");
    console.log("4. View Monthly Report");
  }

  console.log("0. Exit");

  rl.question("Enter your choice: ", (choice) => {
    if (role === "admin") {
      handleAdminOperations(choice, socket, rl);
    } else if (role === "chef") {
      handleChefOperations(choice, socket, rl);
    } else if (role === "employee") {
      handleEmployeeOperations(choice, socket, rl);
    } else {
      console.log("Invalid role, please try again.");
      promptUserOperations(socket, rl);
    }
  });
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
      promptUserOperations(socket, rl);
      break;
  }
}

function handleChefOperations(
  choice: string,
  socket: CustomSocket,
  rl: readline.Interface
) {
  switch (choice) {
    case "1":
      viewMenu(socket, rl);
      break;
    case "2":
      rollOutNewMenu(socket, rl);
      break;
    case "3":
      generateMonthlyReport(socket, rl);
      break;
    case "4":
      viewReport(socket, rl);
      break;
    case "5":
      viewFeedbacks(socket, rl);
      break;
    case "0":
      rl.close();
      socket.close();
      console.log("Goodbye!");
      break;
    default:
      console.log("Invalid choice, please try again.");
      promptUserOperations(socket, rl);
      break;
  }
}

function handleEmployeeOperations(
  choice: string,
  socket: CustomSocket,
  rl: readline.Interface
) {
  switch (choice) {
    case "1":
      viewMenu(socket, rl);
      break;
    case "2":
      addFeedback(socket, rl);
      break;
    case "3":
      viewMyFeedbacks(socket, rl);
      break;
    case "4":
      viewMonthlyReport(socket, rl);
      break;
    case "0":
      rl.close();
      socket.close();
      console.log("Goodbye!");
      break;
    default:
      console.log("Invalid choice, please try again.");
      promptUserOperations(socket, rl);
      break;
  }
}

export function viewMenu(socket: CustomSocket, rl: readline.Interface) {
  console.log("Requesting menu data...");

  socket.emit("viewMenu", (response: any) => {
    console.log("Received menu data:");
    console.log(response);

    rl.question("Press Enter to continue...", () => {});
  });
}

export function viewMonthlyReport(
  socket: CustomSocket,
  rl: readline.Interface
) {
  console.log("Admin operation: View Monthly Report");
}
