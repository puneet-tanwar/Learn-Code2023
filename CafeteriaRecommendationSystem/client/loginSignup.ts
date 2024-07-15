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

  private async promptLoginSignup() {
    console.log("\nChoose an operation:");
    console.log("1. Sign Up");
    console.log("2. Log In");
    console.log("0. Exit");

    const choice = await this.question("Enter your choice: ");
    switch (choice) {
      case "1":
        await this.signup();
        break;
      case "2":
        await this.login();
        break;
      case "0":
        this.rl.close();
        this.socket.close();
        console.log("Goodbye!");
        break;
      default:
        console.log("Invalid choice, please try again.");
        await this.promptLoginSignup();
        break;
    }
  }

  private async login() {
    const email = await this.question("Enter your username: ");
    const password = await this.question("Enter your password: ");

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
  }

  private async signup() {
    const name = await this.question("Enter your name: ");
    const email = await this.question("Enter your username: ");
    const password = await this.question("Enter your password: ");

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
  }

  private async question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (answer) => resolve(answer));
    });
  }
}
