import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { AdminOperationsHandler } from "./adminOperations";
import { ChefOperationsHandler } from "./chefOperations";
import { EmployeeOperationsHandler } from "./employeeOperations";

export class UserOperationsHandler {
  private socket: CustomSocket;
  private rl: readline.Interface;

  constructor(socket: CustomSocket, rl: readline.Interface) {
    this.socket = socket;
    this.rl = rl;
  }

  public initiate() {
    this.promptUserOperations();
  }

  private promptUserOperations() {
    console.log("\nChoose an operation:");
    const role = this.socket.currentUserRole;
    console.log({ role: role });

    switch (role) {
      case "admin":
        this.displayAdminOptions();
        break;
      case "chef":
        this.displayChefOptions();
        break;
      case "employee":
        this.displayEmployeeOptions();
        break;
      default:
        console.log("Invalid role, please try again.");
        this.promptUserOperations();
        break;
    }

    this.rl.question("Enter your choice: ", (choice) => {
      this.handleUserOperation(choice, role);
    });
  }

  private handleUserOperation(choice: string, role: String) {
    switch (role) {
      case "admin":
        new AdminOperationsHandler(this.socket, this.rl).handle(choice);
        break;
      case "chef":
        new ChefOperationsHandler(this.socket, this.rl).handle(choice);
        break;
      case "employee":
        new EmployeeOperationsHandler(this.socket, this.rl).handle(choice);
        break;
      default:
        console.log("Invalid role, please try again.");
        this.promptUserOperations();
        break;
    }
  }

  private displayAdminOptions() {
    console.log("1. Create New User Account");
    console.log("2. View Menu");
    console.log("3. Update Menu Item");
    console.log("4. Add New Menu Item");
    console.log("5. Delete Menu Item");
    console.log("6. View Monthly Report");
    console.log("0. Exit");
  }

  private displayChefOptions() {
    console.log("1. View Menu");
    console.log("2. Roll Out New Menu");
    console.log("3. Generate Recommendations");    
    console.log("4. View Feedbacks");
    console.log("5. Generate Items to be discarded");
    console.log("6. View feedbacks for discarded Items");
    console.log("0. Exit");
  }

  private displayEmployeeOptions() {
    console.log("1. View Menu");
    console.log("2. Add Feedback");
    console.log("3. View Feedbacks");
    console.log("4. View Rolled Out Menu");
    console.log("5. Vote for menu item");
    console.log("6. View my Notifications");
    console.log("7. Add feedback for discarded item");
    console.log("0. Exit");
  }
}
