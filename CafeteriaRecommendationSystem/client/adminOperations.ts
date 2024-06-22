import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { viewMenu } from "./viewMenu";
import { UserOperationsHandler } from "./userOperations";

export class AdminOperationsHandler {
  private socket: CustomSocket;
  private rl: readline.Interface;

  constructor(socket: CustomSocket, rl: readline.Interface) {
    this.socket = socket;
    this.rl = rl;
  }

  public handle(choice: string) {
    switch (choice) {
      case "1":
        this.addUser();
        break;
      case "2":
        viewMenu(this.socket, this.rl);
        break;
      case "3":
        this.updateMenuItem();
        break;
      case "4":
        this.addNewItem();
        break;
      case "5":
        this.deleteItem();
        break;
      case "6":
        this.viewMonthlyReport();
        break;
      case "0":
        this.rl.close();
        this.socket.close();
        console.log("Goodbye!");
        break;
      default:
        console.log("Invalid choice, please try again.");
        new UserOperationsHandler(this.socket, this.rl).initiate();
        break;
    }
  }

  private addUser() {
    console.log("Admin operation: Add User");
    // Implementation here
  }

  private updateMenuItem() {
    console.log("Admin operation: Update Menu Item");
    this.rl.question("Enter the ID of the menu item to update: ", (id) => {
      this.rl.question("Enter the new name of the menu item: ", (name) => {
        this.rl.question("Enter the new description: ", (description) => {
          this.rl.question("Enter the new price: ", (price) => {
            this.rl.question(
              "Enter the new availability status (available/unavailable): ",
              (availability_status) => {
                const updatedItem = {
                  id,
                  name,
                  description,
                  price,
                  availability_status,
                };

                this.socket.emit("updateMenuItem", updatedItem, (response: any) => {
                  if (response.status === "success") {
                    console.log("Menu item updated successfully.");
                  } else {
                    console.log("Failed to update menu item:", response.error);
                  }
                  new UserOperationsHandler(this.socket, this.rl).initiate();
                });
              }
            );
          });
        });
      });
    });
  }

  private addNewItem() {
    console.log("Admin operation: Add New Item");
    this.rl.question("Enter the name of the menu item: ", (name) => {
      this.rl.question("Enter the description: ", (description) => {
        this.rl.question("Enter the price: ", (price) => {
          this.rl.question(
            "Enter the availability status (available/unavailable): ",
            (availability_status) => {
              const newItem = {
                name,
                description,
                price,
                availability_status,
              };

              this.socket.emit("addedMenuItem", newItem, (response: any) => {
                if (response.status === "success") {
                  console.log("Menu item added successfully.");
                } else {
                  console.log("Failed to add menu item:", response.error);
                }
                new UserOperationsHandler(this.socket, this.rl).initiate();
              });
            }
          );
        });
      });
    });
  }

  private deleteItem() {
    console.log("Admin operation: Delete Item");
    this.rl.question("Enter the ID of the menu item to delete: ", (id) => {
      this.socket.emit("deleteMenuItem", { id }, (response: any) => {
        if (response.status === "success") {
          console.log("Menu item deleted successfully.");
        } else {
          console.log("Failed to delete menu item:", response.error);
        }
        new UserOperationsHandler(this.socket, this.rl).initiate();
      });
    });
  }

  private viewMonthlyReport() {
    console.log("Admin operation: View Monthly Report");
    // Implementation here
  }
}
