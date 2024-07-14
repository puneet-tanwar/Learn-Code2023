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

  public async getRecommendationsForUser(userId: number): Promise<any> {
    try {
      const userPreferences = await this.userService.getUserPreferences(userId);
      const menuItems = await this.userService.getMenuItems();
      const feedbacks = await this.feedbackService.getAllFeedback();
      if (!userPreferences)
        return { status: "error", error: "no user preferences" };
      const menuItemScores: {
        [key: number]: {
          totalScore: number;
          count: number;
          sentiment: number;
          preferenceScore: number;
        };
      } = {};

      feedbacks.forEach((feedback: any) => {
        if (!menuItemScores[feedback.menuItemId]) {
          menuItemScores[feedback.menuItemId] = {
            totalScore: 0,
            count: 0,
            sentiment: 0,
            preferenceScore: 0,
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

      // Calculate preference score for each menu item
      const filteredMenuItems = menuItems.filter((item: any) => {
        if (userPreferences.isVeg && !item.is_vegetarian) return false;
        if (!userPreferences.isEggetarian && item.is_eggetarian) return false;
        return true;
      });

      filteredMenuItems.forEach((item: any) => {
        if (!menuItemScores[item.id]) {
          menuItemScores[item.id] = {
            totalScore: 0,
            count: 0,
            sentiment: 0,
            preferenceScore: 0,
          };
        }
        let preferenceScore = 0;

        if (userPreferences.isVeg && item.is_vegetarian) preferenceScore += 1;
        if (userPreferences.isEggetarian && item.is_eggetarian)
          preferenceScore += 1;
        if (userPreferences.hasSweetTooth && item.is_sweet)
          preferenceScore += 1;
        if (item.spicy_level && item.spicy_level <= userPreferences.spiceLevel)
          preferenceScore += 1;
        if (
          userPreferences.cuisinePreference &&
          item.cuisine_type === userPreferences.cuisinePreference
        )
          preferenceScore += 1;

        menuItemScores[item.id].preferenceScore = preferenceScore;
      });

      const sortedMenuItems = filteredMenuItems
        .map((item: any) => {
          const scoreData = menuItemScores[item.id] || {
            totalScore: 0,
            count: 0,
            sentiment: 0,
            preferenceScore: 0,
          };
          const avgScore =
            scoreData.count > 0 ? scoreData.totalScore / scoreData.count : 0;
          return {
            ...item,
            avgScore,
            sentiment:
              scoreData.count > 0 ? scoreData.sentiment / scoreData.count : 0,
            preferenceScore: scoreData.preferenceScore,
          };
        })
        .sort(
          (a, b) =>
            b.preferenceScore - a.preferenceScore || b.avgScore - a.avgScore
        )
        .slice(0, 5);

      return { status: "success", result: sortedMenuItems };
    } catch (error: any) {
      return { status: "error", error: error.message };
    }
  }
}
