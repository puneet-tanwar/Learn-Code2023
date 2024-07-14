import { CustomSocket } from "../types/customSocket";
import { SentimentAnalyzer } from "./sentimentAnalyzer";
import { UserService } from "../services/userService";
import { FeedbackService } from "../services/feedbackService";

export class RecommendationSystem {
  private socket: CustomSocket;
  private sentimentAnalyzer: SentimentAnalyzer;
  private userService = new UserService();
  private feedbackService = new FeedbackService();

  constructor(socket: CustomSocket) {
    this.socket = socket;
    this.sentimentAnalyzer = new SentimentAnalyzer();
  }

  public async getRecommendations(): Promise<any> {
    try {
      const menuItems = await this.userService.getMenuItems();
      const feedbacks = await this.feedbackService.getAllFeedback();

      const menuItemScores: {
        [key: number]: {
          totalScore: number;
          count: number;
          sentiment: number;
        };
      } = {};

      feedbacks.forEach((feedback: any) => {
        if (!menuItemScores[feedback.menuItemId]) {
          menuItemScores[feedback.menuItemId] = {
            totalScore: 0,
            count: 0,
            sentiment: 0,
          };
        }
        const normalizedRating = (feedback.rating / 5) * 100;

        const sentimentScore = this.sentimentAnalyzer.analyzeSentiment([
          feedback.review,
        ]).score;

        menuItemScores[feedback.menuItemId].totalScore +=
          normalizedRating + sentimentScore;
        menuItemScores[feedback.menuItemId].count += 1;
        menuItemScores[feedback.menuItemId].sentiment += sentimentScore;
      });

      const sortedMenuItems = Object.keys(menuItemScores)
        .map((key: string) => {
          const menuItem = menuItems.find(
            (item: any) => item.id === parseInt(key)
          );
          const scoreData = menuItemScores[parseInt(key)];
          const avgScore = scoreData.totalScore / scoreData.count;
          return {
            ...menuItem,
            avgScore,
            sentiment: scoreData.sentiment / scoreData.count,
          };
        })
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 5);

      sortedMenuItems.forEach((item) => {
        item.avgScore /= 2;
      });

      return { status: "success", result: sortedMenuItems };
    } catch (error: any) {
      return { status: "error", error: error.message };
    }
  }

  public async getMenuItemsToBeDiscarded(): Promise<any> {
    try {
      const menuItems = await this.userService.getMenuItems();
      const feedbacks = await this.feedbackService.getAllFeedback();

      const menuItemScores: {
        [key: number]: {
          totalScore: number;
          count: number;
          sentiment: number;
        };
      } = {};

      feedbacks.forEach((feedback: any) => {
        if (!menuItemScores[feedback.menuItemId]) {
          menuItemScores[feedback.menuItemId] = {
            totalScore: 0,
            count: 0,
            sentiment: 0,
          };
        }
        const normalizedRating = (feedback.rating / 5) * 100;

        const sentimentScore = this.sentimentAnalyzer.analyzeSentiment([
          feedback.review,
        ]).score;

        menuItemScores[feedback.menuItemId].totalScore +=
          normalizedRating + sentimentScore;
        menuItemScores[feedback.menuItemId].count += 1;
        menuItemScores[feedback.menuItemId].sentiment += sentimentScore;
      });

      const sortedMenuItems = Object.keys(menuItemScores)
        .map((key: string) => {
          const menuItem = menuItems.find(
            (item: any) => item.id === parseInt(key)
          );
          const scoreData = menuItemScores[parseInt(key)];
          const avgScore = scoreData.totalScore / scoreData.count;
          return {
            ...menuItem,
            avgScore,
            sentiment: scoreData.sentiment / scoreData.count,
          };
        })
        .sort((a, b) => a.avgScore - b.avgScore)
        .slice(0, 5);

      sortedMenuItems.forEach((item) => {
        item.avgScore /= 2;
      });

      return { status: "success", result: sortedMenuItems };
    } catch (error) {
      return { status: "error", error: error };
    }
  }
}
