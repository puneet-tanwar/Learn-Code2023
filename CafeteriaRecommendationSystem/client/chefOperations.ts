import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { viewMenu } from "./viewMenu";
import { UserOperationsHandler } from "./userOperations";
// import { RecommendationSystem } from "../server/utils/RecommendationSystem";

export class ChefOperationsHandler {
  private socket: CustomSocket;
  private rl: readline.Interface;
  // private recommendationSystem: RecommendationSystem;

  constructor(socket: CustomSocket, rl: readline.Interface) {
    this.socket = socket;
    this.rl = rl;
    // this.recommendationSystem = new RecommendationSystem(socket);
  }

  public handle(choice: string) {
    switch (choice) {
      case "1":
        viewMenu(this.socket, this.rl);
        break;
      case "2":
        this.rollOutNewMenu();
        break;
      case "3":
        this.getRecommendations();
        break;
      case "4":
        this.viewFeedbacks();
        break;
      case "5":
        this.getDiscardedList();
        break;
      case "6":
        this.viewDiscardedItemFeedback();
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

  private rollOutNewMenu() {
    console.log("Chef operation: Roll Out New Menu");
    this.rl.question(
      "Enter the IDs of menu items for the next day's Menu, separated by spaces: ",
      (input) => {
        const selectedItems = input
          .split(" ")
          .map((id: string) => parseInt(id, 10));

        this.socket.emit("rollOutMenu", selectedItems, (response: any) => {
          if (response.status === "success") {
            console.log("New menu items rolled out successfully.");
          } else {
            console.log("Failed to roll out new menu items:", response.error);
          }
          new UserOperationsHandler(this.socket, this.rl).initiate();
        });
      }
    );
  }

  private getRecommendations() {
    console.log("Chef operation: Get Recommendations");
    this.socket.emit("getRecommendations", (response: any) => {
      if (response.status === "success") {
        const formattedRecommendations = response.result.result.map(
          (item: any) => ({
            "Menu Item ID": item.id,
            Name: item.name,
            Price: item.price,
            "Sentiment Score": item.avgScore.toFixed(2),
            "Last Updated": new Date(item.updated_at).toLocaleString(),
          })
        );
        console.table(formattedRecommendations);
      } else {
        console.log("Failed to fetch recommendations:", response.error);
      }
      new UserOperationsHandler(this.socket, this.rl).initiate();
    });
  }

  private getDiscardedList() {
    console.log("Chef operation: Get Discarded List");
    this.socket.emit("getDiscardedList", (response: any) => {
      if (response.status === "success") {
        const formattedItems = response.result.result.map((item: any) => ({
          "Menu Item ID": item.id,
          Name: item.name,
          Price: item.price,
          "Sentiment Score": item.avgScore.toFixed(2),
          "Last Updated": new Date(item.updated_at).toLocaleString(),
        }));
        console.table(formattedItems);
        this.askForDiscardDecision(response.result);
      } else {
        console.log("Failed to fetch discarded items:", response.error);
        new UserOperationsHandler(this.socket, this.rl).initiate();
      }
    });
  }

  private askForDiscardDecision(items: any[]) {
    this.rl.question("Enter item ID to discard: ", (input) => {
      const itemId = parseInt(input, 10);
      const itemToDiscard = items.find((item) => item.id === itemId);
      if (itemToDiscard) {
        this.socket.emit("discardItem", itemToDiscard, (response: any) => {
          if (response.status === "success") {
            console.log(
              `Item "${itemToDiscard.name}" (ID: ${itemToDiscard.id}) has been marked as discarded.`
            );
          } else {
            console.log(
              `Failed to discard item "${itemToDiscard.name}" (ID: ${itemToDiscard.id}):`,
              response.error
            );
          }
          new UserOperationsHandler(this.socket, this.rl).initiate();
        });
      } else {
        console.log("Invalid item ID. Please try again.");
        this.askForDiscardDecision(items);
      }
    });
  }
  private viewDiscardedItemFeedback() {
    console.log("Employee operation: View Feedback");
    this.socket.emit("getLatestDiscardedItem", (response: any) => {
      if (response.status === "success" && response.result) {
        const discardedItem = response.result;
        console.log(`Latest discarded item: ${discardedItem.item_name}`);
        this.socket.emit(
          "getFeedbackForDiscardedItem",
          discardedItem.discardedItemId,
          (feedbackResponse: any) => {
            if (
              feedbackResponse.status === "success" &&
              feedbackResponse.result
            ) {
              const feedback = feedbackResponse.result;
              console.log(
                `Feedback for discarded item (${discardedItem.item_name}):`
              );
              console.table(feedback);
            } else {
              console.log(
                `No feedback available for discarded item (ID: ${discardedItem.discardedItemId}).`
              );
            }
            new UserOperationsHandler(this.socket, this.rl).initiate();
          }
        );
      } else {
        console.log("No discarded items available.");
        new UserOperationsHandler(this.socket, this.rl).initiate();
      }
    });
  }
  private viewFeedbacks() {
    console.log("Chef operation: View Feedbacks");
    new UserOperationsHandler(this.socket, this.rl).initiate();
  }
}
