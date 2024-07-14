import { Server, Socket } from "socket.io";
import { UserService } from "./services/userService";
import { AdminService } from "./services/adminService";
import { User, UserRole } from "./types/user";
import { MenuItem } from "./types/menuItem";
import { Server as HttpServer } from "http";
import { Feedback } from "./types/feedback";
import { FeedbackService } from "./services/feedbackService";
import { NotificationService } from "./services/notificationService";
import { ChefService } from "./services/chefService";
import { RecommendationSystem } from "./utils/RecommendationSystem";
import { DiscardedFeedback } from "./types/discardedFeedback";
import { UserPreferences } from "./types/userPreferences";

interface CallbackResponse {
  status: "success" | "error";
  result?: any;
  error?: any;
}

interface CustomSocket extends Socket {
  role?: UserRole;
  currentUserId?: number;
}

export class SocketServer {
  private io: Server;
  private userService = new UserService();
  private adminService = new AdminService();
  private feedbackService = new FeedbackService();
  private chefService = new ChefService();
  private notificationService = new NotificationService();
  private userSessions = new Map<string, User>();
  // private recommendationSystem: RecommendationSystem;
  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.initializeSocket();
    // this.recommendationSystem = new RecommendationSystem(socket);
  }

  private initializeSocket() {
    this.io.on("connection", (socket: CustomSocket) => {
      console.log("A user connected");
      this.handleSignup(socket);
      this.handleLogin(socket);
      this.handleViewMenu(socket);
      this.handleAddMenuItem(socket);
      this.handleUpdateMenuItem(socket);
      this.handleDeleteMenuItem(socket);
      this.handleAddFeedback(socket);
      this.handleViewFeedback(socket);
      this.handleGetRecommendations(socket);
      this.handleRollOutMenu(socket);
      this.handleVoting(socket);
      this.handleViewRolledOutMenu(socket);
      this.handleViewNotifications(socket);
      this.handleDiscardItem(socket);
      this.handleGetLatestDiscardedItem(socket);
      this.handleAddFeedbackForDiscardedItem(socket);
      this.handleGetFeedbackForDiscardedItem(socket);
      this.handleUpdateUserPreferences(socket);
      this.handleGetDiscardedList(socket);
      this.handleDisconnect(socket);
    });
  }

  private handleSignup(socket: CustomSocket) {
    socket.on(
      "signup",
      async (user: User, callback: (response: CallbackResponse) => void) => {
        try {
          console.debug({ dataComingFromUser: user });
          const result = await this.userService.createUser(user);
          result.userRole = user.role;
          this.userSessions.set(socket.id, user);
          callback({ status: "success" });
        } catch (error) {
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleLogin(socket: CustomSocket) {
    socket.on(
      "login",
      async (
        loginData: { email: string; password: string },
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          const user = await this.userService.getUserByEmail(loginData.email);
          if (user && user.password === loginData.password) {
            socket.data.currentUser = user;
            this.userSessions.set(socket.id, user);
            console.warn({ userSessions: this.userSessions });
            callback({ status: "success", result: user });
          } else {
            callback({ status: "error", error: "Invalid email or password" });
          }
        } catch (error) {
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleViewMenu(socket: CustomSocket) {
    socket.on(
      "viewMenu",
      async (callback: (response: CallbackResponse) => void) => {
        try {
          console.log({ callback });
          const menuItems = await this.userService.getMenuItems();
          callback({ status: "success", result: menuItems });
        } catch (error) {
          console.error("Error fetching menu items:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleAddMenuItem(socket: CustomSocket) {
    socket.on(
      "addedMenuItem",
      async (newItem: any, callback: (response: CallbackResponse) => void) => {
        try {
          await this.adminService.addMenuItem(newItem);
          callback({ status: "success" });
        } catch (error) {
          console.error("Error adding menu item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleUpdateMenuItem(socket: CustomSocket) {
    socket.on(
      "updateMenuItem",
      async (
        updatedItem: MenuItem,
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          await this.adminService.updateMenuItem(updatedItem);
          callback({ status: "success" });
        } catch (error) {
          console.error("Error updating menu item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleDeleteMenuItem(socket: CustomSocket) {
    socket.on(
      "deleteMenuItem",
      async (
        itemData: { id: string },
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          await this.adminService.deleteMenuItem(itemData.id);
          callback({ status: "success" });
        } catch (error) {
          console.error("Error deleting menu item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleAddFeedback(socket: CustomSocket) {
    socket.on(
      "addFeedback",
      async (
        feedback: Feedback,
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          await this.feedbackService.addFeedback(feedback);

          callback({ status: "success" });
        } catch (error) {
          console.error("Error adding feedback:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleViewFeedback(socket: CustomSocket) {
    socket.on(
      "viewFeedback",
      async (
        menuItemId: number,
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          const feedbacks = await this.feedbackService.getFeedbackByMenuItem(
            menuItemId
          );
          callback({ status: "success", result: feedbacks });
        } catch (error) {
          console.error("Error fetching feedbacks:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleGetRecommendations(socket: any) {
    socket.on(
      "getRecommendations",
      async (callback: (response: CallbackResponse) => void) => {
        try {
          const recommendationSystem = new RecommendationSystem(socket);
          const response = await recommendationSystem.getRecommendations();

          callback({ status: "success", result: response });
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleRollOutMenu(socket: CustomSocket) {
    socket.on(
      "rollOutMenu",
      async (
        menuItemIds: number[],
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          await this.chefService.proposeMenuItems(menuItemIds);
          callback({ status: "success" });
        } catch (error) {
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleViewRolledOutMenu(socket: CustomSocket) {
    socket.on(
      "viewRolledOutMenu",
      async (callback: (response: CallbackResponse) => void) => {
        try {
          const proposedMenuItems =
            await this.userService.getProposedMenuItems();
          callback({
            status: "success",
            result: proposedMenuItems,
          });
        } catch (error) {
          console.error("Error fetching proposed menu items:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleVoting(socket: CustomSocket) {
    socket.on(
      "voteForMenuItem",
      async (
        voteData: { menuItemId: number; employeeId: number },
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          await this.userService.voteForMenuItem(
            voteData.menuItemId,
            voteData.employeeId
          );
          callback({ status: "success" });
        } catch (error) {
          console.error("Error voting for menu item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  // server.ts
  private handleViewNotifications(socket: CustomSocket) {
    socket.on(
      "viewNotifications",
      async (callback: (response: CallbackResponse) => void) => {
        try {
          const notifications =
            await this.notificationService.getNotifications();
          callback({
            status: "success",
            result: notifications,
          });
        } catch (error) {
          console.error("Error fetching notifications:", error);
          callback({ status: "error", error });
        }
      }
    );
  }
  private handleGetDiscardedList(socket: any) {
    socket.on(
      "getDiscardedList",
      async (callback: (response: CallbackResponse) => void) => {
        try {
          console.log("getting discarded items");
          const recommendationSystem = new RecommendationSystem(socket);
          const response =
            await recommendationSystem.getMenuItemsToBeDiscarded();

          callback({ status: "success", result: response });
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          callback({ status: "error", error });
        }
      }
    );
  }
  private handleDiscardItem(socket: CustomSocket) {
    socket.on(
      "discardItem",
      async (item, callback: (response: CallbackResponse) => void) => {
        try {
          await this.chefService.discardMenuItem(item);
          callback({ status: "success" });
        } catch (error) {
          console.error("Error discarding item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleGetLatestDiscardedItem(socket: CustomSocket) {
    socket.on(
      "getLatestDiscardedItem",
      async (callback: (response: CallbackResponse) => void) => {
        try {
          const discardedItem = await this.userService.getLatestDiscardedItem();
          console.log({ discardedItem });
          console.log({ callback });
          if (discardedItem) {
            callback({ status: "success", result: discardedItem });
          } else {
            callback({ status: "error", error: "No discarded item available" });
          }
        } catch (error) {
          console.error("Error fetching latest discarded item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }

  private handleAddFeedbackForDiscardedItem(socket: CustomSocket) {
    socket.on(
      "addFeedbackForDiscardedItem",
      async (
        feedback: DiscardedFeedback,
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          // Assuming feedbackService is properly defined and imported
          await this.userService.addFeedbackForDiscardedItem(feedback);
          callback({ status: "success" });
        } catch (error) {
          console.error("Error adding feedback for discarded item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }
  private handleGetFeedbackForDiscardedItem(socket: CustomSocket) {
    socket.on(
      "getFeedbackForDiscardedItem",
      async (
        itemId: string,
        callback: (response: CallbackResponse) => void
      ) => {
        try {
          // Assuming userService has a method to retrieve feedback for discarded items
          const feedback = await this.chefService.getFeedbackForDiscardedItem(
            itemId
          );
          if (feedback) {
            callback({ status: "success", result: feedback });
          } else {
            callback({
              status: "error",
              error: "No feedback available for this discarded item",
            });
          }
        } catch (error) {
          console.error("Error fetching feedback for discarded item:", error);
          callback({ status: "error", error });
        }
      }
    );
  }
  private handleUpdateUserPreferences(socket: CustomSocket) {
    socket.on(
      "updateUserPreferences",
      async (preferences: UserPreferences, callback) => {
        try {
          await this.userService.updateUserPreferences(preferences);
          callback({
            status: "success",
            message: "Preferences updated successfully.",
          });
        } catch (error) {
          console.error("Error updating preferences:", error);
          callback({
            status: "error",
            message: "Failed to update preferences.",
          });
        }
      }
    );
  }
  private handleDisconnect(socket: CustomSocket) {
    socket.on("disconnect", () => {
      console.log("A user disconnected");
      this.userSessions.delete(socket.id);
    });
  }
}
