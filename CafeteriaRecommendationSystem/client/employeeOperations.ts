import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { viewMenu } from "./viewMenu";
import { UserOperationsHandler } from "./userOperations";
import { RecommendationSystem } from "../server/utils/RecommendationSystem";

export class EmployeeOperationsHandler {
  private socket: CustomSocket;
  private rl: readline.Interface;
  private recommendationSystem: RecommendationSystem;

  constructor(socket: CustomSocket, rl: readline.Interface) {
    this.socket = socket;
    this.rl = rl;
    this.recommendationSystem = new RecommendationSystem(socket);
  }

  public handle(choice: string) {
    switch (choice) {
      case "1":
        viewMenu(this.socket, this.rl);
        break;
      case "2":
        this.addFeedback();
        break;
      case "3":
        this.viewFeedback();
        break;
      case "4":
        this.viewRolledOutMenu();
        break;
      case "5":
        this.voteForMenuItem();
        break;
      case "6":
        this.viewNotifications();
        break;
      case "7":
        this.addFeedbackForDiscardedItem();
        break;
      case "8":
        this.updateMyPreference();
        break;
      case "9":
        this.getRecommendationForUser();
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

  private addFeedback() {
    console.log("Employee operation: Add Feedback");
    this.rl.question("Enter the ID of the menu item: ", (menuItemId) => {
      this.rl.question("Enter your rating (1-5): ", (rating) => {
        this.rl.question("Enter your review: ", (review) => {
          const feedback = {
            menuItemId: parseInt(menuItemId, 10),
            employeeId: this.socket.currentUserId,
            rating: parseFloat(rating),
            review,
          };

          this.socket.emit("addFeedback", feedback, (response: any) => {
            if (response.status === "success") {
              console.log("Feedback added successfully.");
            } else {
              console.log("Failed to add feedback:", response.error);
            }
            new UserOperationsHandler(this.socket, this.rl).initiate();
          });
        });
      });
    });
  }

  private viewFeedback() {
    console.log("Employee operation: View Feedback");
    this.rl.question("Enter the ID of the menu item: ", (menuItemId) => {
      this.socket.emit(
        "viewFeedback",
        parseInt(menuItemId, 10),
        (response: any) => {
          if (response.status === "success") {
            console.log(`Feedbacks for Menu Item ID ${menuItemId}:`);
            const formattedFeedbacks = response.result.map((feedback: any) => ({
              Rating: feedback.rating,
              Review: feedback.review,
              Date: new Date(feedback.created_at).toLocaleString(),
            }));
            console.table(formattedFeedbacks);
          } else {
            console.log("Failed to fetch feedbacks:", response.error);
          }
          new UserOperationsHandler(this.socket, this.rl).initiate();
        }
      );
    });
  }

  private voteForMenuItem() {
    console.log("Employee operation: Vote for Menu Item");
    this.rl.question(
      "Enter the ID of the menu item you want to vote for: ",
      (menuItemId) => {
        const menuItemIdInt = parseInt(menuItemId, 10);
        if (isNaN(menuItemIdInt)) {
          console.log("Invalid menu item ID. Please enter a valid number.");
          this.voteForMenuItem();
          return;
        }

        const voteData = {
          menuItemId: menuItemIdInt,
          employeeId: this.socket.currentUserId,
        };

        this.socket.emit("voteForMenuItem", voteData, (response: any) => {
          if (response.status === "success") {
            console.log(`Voted successfully for Menu Item ID ${menuItemId}.`);
          } else {
            console.log("Failed to vote for menu item:", response.error);
          }
        });
        new UserOperationsHandler(this.socket, this.rl).initiate();
      }
    );
  }

  private viewRolledOutMenu() {
    console.log("Chef operation: View Rolled Out Menu");
    this.socket.emit("viewRolledOutMenu", (response: any) => {
      if (response.status === "success") {
        console.log("Current Proposed Menu Items for Voting:");
        const formattedMenuItems = response.result.map((menuItem: any) => ({
          "Menu Item ID": menuItem.menuItemId,
          "Menu Item Name": menuItem.name,
          Votes: menuItem.votes,
        }));
        console.table(formattedMenuItems);
      } else {
        console.log("Failed to fetch proposed menu items:", response.error);
      }
      new UserOperationsHandler(this.socket, this.rl).initiate();
    });
  }
  // userOperationsHandler.ts
  private viewNotifications() {
    console.log("Employee operation: View Notifications");
    this.socket.emit("viewNotifications", (response: any) => {
      if (response.status === "success") {
        console.log("Latest Notifications:");
        const formattedNotifications = response.result.map(
          (notification: any) => ({
            Title: notification.title,
            Description: notification.description,
            Date: new Date(notification.date).toLocaleString(),
          })
        );
        console.table(formattedNotifications);
      } else {
        console.log("Failed to fetch notifications:", response.error);
      }
      new UserOperationsHandler(this.socket, this.rl).initiate();
    });
  }
  private addFeedbackForDiscardedItem() {
    console.log("Employee operation: Add Feedback for Discarded Item");
    this.socket.emit("getLatestDiscardedItem", (response: any) => {
      if (response.status === "success" && response.result) {
        const discardedItem = response.result;
        console.log(`Latest discarded item: ${discardedItem.item_name}`);

        this.rl.question(
          "What didn't you like about the food? ",
          (dislikedAspect) => {
            this.rl.question(
              "How would you like the dish to taste? ",
              (preferredTaste) => {
                this.rl.question("Share your mom's recipe: ", (momsRecipe) => {
                  const feedback = {
                    discardedItemId: discardedItem.discardedItemId,
                    employeeId: this.socket.currentUserId,
                    dislikedAspect,
                    preferredTaste,
                    momsRecipe,
                  };

                  this.socket.emit(
                    "addFeedbackForDiscardedItem",
                    feedback,
                    (response: any) => {
                      if (response.status === "success") {
                        console.log(
                          "Feedback for discarded item added successfully."
                        );
                      } else {
                        console.log(
                          "Failed to add feedback for discarded item:",
                          response.error
                        );
                      }
                      new UserOperationsHandler(
                        this.socket,
                        this.rl
                      ).initiate();
                    }
                  );
                });
              }
            );
          }
        );
      } else {
        console.log("No discarded items available.");
        new UserOperationsHandler(this.socket, this.rl).initiate();
      }
    });
  }
  private updateMyPreference() {
    console.log("Employee operation: Update My Preferences");

    this.rl.question(
      "Are you eggetarian? (1 for yes, 0 for no): ",
      (isEggetarianAnswer) => {
        const isEggetarian = parseInt(isEggetarianAnswer, 10) === 1;

        this.rl.question(
          "Are you vegetarian? (1 for yes, 0 for no): ",
          (isVegAnswer) => {
            const isVeg = parseInt(isVegAnswer, 10) === 1;

            this.rl.question(
              "Spice level preference (1-10): ",
              (spiceLevelAnswer) => {
                const spiceLevel = parseInt(spiceLevelAnswer, 10);
                if (isNaN(spiceLevel) || spiceLevel < 1 || spiceLevel > 10) {
                  console.log(
                    "Invalid spice level. Please enter a number between 1 and 10."
                  );
                  this.updateMyPreference();
                  return;
                }

                this.rl.question(
                  "Cuisine preference: ",
                  (cuisinePreference) => {
                    this.rl.question(
                      "Do you have a sweet tooth? (1 for yes, 0 for no): ",
                      (hasSweetToothAnswer) => {
                        const hasSweetTooth =
                          parseInt(hasSweetToothAnswer, 10) === 1;

                        const preferences = {
                          userId: this.socket.currentUserId,
                          isEggetarian,
                          isVeg,
                          spiceLevel,
                          cuisinePreference,
                          hasSweetTooth,
                        };

                        this.socket.emit(
                          "updateUserPreferences",
                          preferences,
                          (response: any) => {
                            if (response.status === "success") {
                              console.log("Preferences updated successfully.");
                            } else {
                              console.log(
                                "Failed to update preferences:",
                                response.error
                              );
                            }
                            new UserOperationsHandler(
                              this.socket,
                              this.rl
                            ).initiate();
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  private getRecommendationForUser() {
    console.log("Employee operation: View My Recommendations");
    this.socket.emit("getMyRecommendation", (response: any) => {
      if (response.status === "success") {
        const recommendations = response.result.result;
        const formattedRecommendations = recommendations.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
        }));

        console.table(formattedRecommendations);
      } else {
        console.log("Failed to fetch recommendations:", response.error);
      }
      new UserOperationsHandler(this.socket, this.rl).initiate();
    });
  }
}
