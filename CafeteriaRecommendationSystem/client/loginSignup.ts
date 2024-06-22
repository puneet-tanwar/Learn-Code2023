import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { UserOperationsHandler } from "./userOperations";

export class LoginSignupHandler {
  private socket: CustomSocket;
  private rl: readline.Interface;

  constructor(socket: CustomSocket, rl: readline.Interface) {
    this.socket = socket;
    this.rl = rl;
  }

  public initiate() {
    this.promptLoginSignup();
  }

  private promptLoginSignup() {
    console.log("\nChoose an operation:");
    console.log("1. Sign Up");
    console.log("2. Log In");
    console.log("0. Exit");

    this.rl.question("Enter your choice: ", (choice) => {
      switch (choice) {
        case "1":
          this.signup();
          break;
        case "2":
          this.login();
          break;
        case "0":
          this.rl.close();
          this.socket.close();
          console.log("Goodbye!");
          break;
        default:
          console.log("Invalid choice, please try again.");
          this.promptLoginSignup();
          break;
      }
    });
  }

  private login() {
    this.rl.question("Enter your email: ", (email) => {
      this.rl.question("Enter your password: ", (password) => {
        this.socket.emit('login', { email, password }, (response: any) => {
          if (response.status === 'success') {
            console.log("Login successful");
            this.socket.currentUserRole = response.result.role;
            this.socket.currentUserId = response.result.id;
            const userOperationsHandler = new UserOperationsHandler(this.socket, this.rl);
            userOperationsHandler.initiate();
          } else {
            console.log("Login failed:", response.error);
            this.promptLoginSignup();
          }
        });
      });
    });
  }

  private signup() {
    this.rl.question("Enter your name: ", (name) => {
      this.rl.question("Enter your email: ", (email) => {
        this.rl.question("Enter your password: ", (password) => {
          const user = { name, email, password, role: 'employee' }; // Assuming role is user by default
          this.socket.emit('signup', user, (response: any) => {
            if (response.status === 'success') {
              console.log("Signup successful");
              const userOperationsHandler = new UserOperationsHandler(this.socket, this.rl);
              userOperationsHandler.initiate();
            } else {
              console.log("Signup failed:", response.error);
              this.promptLoginSignup();
            }
          });
        });
      });
    });
  }
}
