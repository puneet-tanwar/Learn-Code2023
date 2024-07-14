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
              "Enter the new availability status (1/0): ",
              (availability_status) => {
                const updatedItem = {
                  id,
                  name,
                  description,
                  price,
                  availability_status,
                };

                this.socket.emit(
                  "updateMenuItem",
                  updatedItem,
                  (response: any) => {
                    if (response.status === "success") {
                      console.log("Menu item updated successfully.");
                    } else {
                      console.log(
                        "Failed to update menu item:",
                        response.error
                      );
                    }
                    new UserOperationsHandler(this.socket, this.rl).initiate();
                  }
                );
              }
            );
          });
        });
      });
    });
  }

  private async addNewItem() {
    console.log("Admin operation: Add New Item");

    const question = (query: string): Promise<string> => {
      return new Promise((resolve) => {
        this.rl.question(query, (answer) => resolve(answer));
      });
    };

    try {
      const name = await question("Enter the name of the menu item: ");
      const description = await question("Enter the description: ");
      const price = parseFloat(await question("Enter the price: "));
      const availability_status =
        (await question("Enter the availability status (1/0): ")) === "1";
      const food_type = await question("Enter the food type: ");
      const is_vegetarian =
        (await question("Is the item vegetarian? (1/0): ")) === "1";
      const spicy_level = parseInt(
        await question("Enter the spicy level (0-10): ")
      );
      const is_eggetarian =
        (await question("Is the item eggetarian? (1/0): ")) === "1";
      const cuisine_type = await question("Enter the cuisine type: ");
      const is_sweet = (await question("Is the item sweet? (1/0): ")) === "1";

      const newItem = {
        name,
        description,
        price,
        availability_status,
        food_type,
        is_vegetarian,
        spicy_level,
        is_eggetarian,
        cuisine_type,
        is_sweet,
      };

      this.socket.emit("addedMenuItem", newItem, (response: any) => {
        if (response.status === "success") {
          console.log("Menu item added successfully.");
        } else {
          console.log("Failed to add menu item:", response.error);
        }
        new UserOperationsHandler(this.socket, this.rl).initiate();
      });
    } catch (error) {
      console.log("Error adding menu item:", error);
      new UserOperationsHandler(this.socket, this.rl).initiate();
    }
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
