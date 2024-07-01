import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { viewMenu } from "./viewMenu";
import { UserOperationsHandler } from "./userOperations";
import { RecommendationSystem } from "../utils/RecommendationSystem";

export class ChefOperationsHandler {
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

  private async getRecommendations() {
    console.log("Chef operation: Get Recommendations");
    try {
      const response = await this.recommendationSystem.getRecommendations();
      if (response.status === "success") {
        const formattedRecommendations = response.result.map((item: any) => ({
          "Menu Item ID": item.id,
          Name: item.name,
          Price: item.price,
          "Average Score": item.avgScore.toFixed(2),
          "Sentiment Score": item.sentiment.toFixed(2),
          "Last Updated": new Date(item.updated_at).toLocaleString(),
        }));
        console.table(formattedRecommendations);
      } else {
        console.log("Failed to fetch recommendations:", response.error);
      }
    } catch (error) {
      console.log("Failed to fetch recommendations:", error);
    } finally {
      new UserOperationsHandler(this.socket, this.rl).initiate();
    }
  }

  private async getDiscardedList() {
    console.log("Chef operation: Get Discarded List");
    try {
      const response =
        await this.recommendationSystem.getMenuItemsToBeDiscarded();
      if (response.status === "success") {
        const formattedItems = response.result.map((item: any) => ({
          "Menu Item ID": item.id,
          Name: item.name,
          Price: item.price,
          "Average Score": item.avgScore.toFixed(2),
          "Dislike Score": item.sentiment.toFixed(2),
          "Last Updated": new Date(item.updated_at).toLocaleString(),
        }));
        console.table(formattedItems);
      } else {
        console.log("Failed to fetch worst items:", response.error);
      }
    } catch (error) {
      console.log("Failed to fetch worst items:", error);
    } finally {
      new UserOperationsHandler(this.socket, this.rl).initiate();
    }
  }

  private viewFeedbacks() {
    console.log("Chef operation: View Feedbacks");
    new UserOperationsHandler(this.socket, this.rl).initiate();
  }
}
