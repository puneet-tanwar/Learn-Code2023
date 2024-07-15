import { runQuery } from "../database";
import { Feedback } from "../types/feedback";

export class FeedbackService {
  async addFeedback(feedback: Feedback): Promise<void> {
    const query =
      "INSERT INTO feedback (menuItemId, employeeId, rating, review) VALUES (?, ?, ?, ?)";
    await runQuery(query, [
      feedback.menuItemId,
      feedback.employeeId,
      feedback.rating,
      feedback.review,
    ]);
  }

  async getFeedbackByMenuItem(menuItemId: number): Promise<Feedback[]> {
    console.log("getting feedback");
    const query = "SELECT * FROM feedback WHERE menuItemId = ?";
    const rows = await runQuery(query, [menuItemId]);
    return rows as Feedback[];
  }
  async getAllFeedback(): Promise<Feedback[]> {
    const query = "SELECT * FROM feedback";
    const rows = await runQuery(query, []);
    return rows as Feedback[];
  }
}
