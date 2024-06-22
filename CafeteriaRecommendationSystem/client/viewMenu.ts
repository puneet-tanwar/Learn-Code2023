import { CustomSocket } from "./types/customSocket";
import readline from "readline";
import { UserOperationsHandler } from "./userOperations";

export function viewMenu(socket: CustomSocket, rl: readline.Interface) {
  console.log("Requesting menu data...");

  socket.emit("viewMenu", (response: any) => {
    if (response.status === "success") {
      console.log("Received menu data:");

      const cleanedMenu = response.result.map((item: any) => {
        const { created_at, updated_at, ...cleanedItem } = item;
        return cleanedItem;
      });

      console.table(cleanedMenu);
    } else {
      console.log("Failed to fetch menu items:", response.error);
    }

    new UserOperationsHandler(socket, rl).initiate();
  });
}
