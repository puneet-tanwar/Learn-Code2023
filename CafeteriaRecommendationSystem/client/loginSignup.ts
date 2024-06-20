import { CustomSocket } from "./types/customSocket";
import readline from "readline";

export function handleLoginSignup(
  socket: CustomSocket,
  rl: readline.Interface,
  promptUserOperations: Function
) {
  console.log("\nChoose an option:");
  console.log("1. Login");
  console.log("2. Signup");
  rl.question("Enter your choice: ", (choice) => {
    if (choice === "1") {
      handleLogin(socket, rl, promptUserOperations);
    } else if (choice === "2") {
      handleSignup(socket, rl, promptUserOperations);
    } else {
      console.log("Invalid choice, please try again.");
      handleLoginSignup(socket, rl, promptUserOperations);
    }
  });
}

function handleLogin(
  socket: CustomSocket,
  rl: readline.Interface,
  promptUserOperations: Function
) {
  rl.question("Enter email: ", (email) => {
    rl.question("Enter password: ", (password) => {
      socket.emit("login", { email, password }, (response: any) => {
        if (response.status === "success") {
          console.log("Login successful");
          console.log("Logged in as ", response.result.role)
          socket.currentUserRole = response.result.role;
          console.log({socket})        
          promptUserOperations(socket, rl);
        } else {
          console.log("Login failed:", response.error);
          handleLoginSignup(socket, rl, promptUserOperations);
        }
      });
    });
  });
}

function handleSignup(
  socket: CustomSocket,
  rl: readline.Interface,
  promptUserOperations: Function
) {
  rl.question("Enter name: ", (name) => {
    rl.question("Enter email: ", (email) => {
      rl.question("Enter password: ", (password) => {
        socket.emit("signup", { name, email, password }, (response: any) => {
          if (response.status === "success") {
            console.log("Signup successful", { response });
            promptUserOperations(socket, rl);
          } else {
            console.log("Signup failed:", response.error);
            handleLoginSignup(socket, rl, promptUserOperations);
          }
        });
      });
    });
  });
}
