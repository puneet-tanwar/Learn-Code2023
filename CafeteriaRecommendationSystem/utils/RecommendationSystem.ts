import { CustomSocket } from "../server/types/customSocket";
import { SentimentAnalyzer } from "./SentimentAnalyzer";

export class RecommendationSystem {
  private socket: CustomSocket;
  private sentimentAnalyzer: SentimentAnalyzer;

  constructor(socket: CustomSocket) {
    this.socket = socket;
    this.sentimentAnalyzer = new SentimentAnalyzer();
  }

  public async getRecommendations(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit("getAllMenuItemsWithFeedbacks", (response: any) => {
        if (response.status === "success") {
          const { menuItems, feedbacks } = response.result;
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
  
            // Normalize feedback.rating to be on a 0-100 scale
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
  
          // Halve the average score
          sortedMenuItems.forEach((item) => {
            item.avgScore /= 2;
          });
  
          resolve({ status: "success", result: sortedMenuItems });
        } else {
          reject({ status: "error", error: response.error });
        }
      });
    });
  }
}
