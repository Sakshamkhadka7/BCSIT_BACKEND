import { Request, Response } from "express";
import QuizAttempt from "../database/model/quizAttemptModel";
import User from "../database/model/userModel";
import sendResponse from "../service/sendResponse";
import { col, fn, literal } from "sequelize";

interface IRequest extends Request { user?: User }

class QuizAttemptController {
  static async createAttempt(req: Request, res: Response) {
    const { score, totalMarks, userId } = req.body;

    if (score === undefined || totalMarks === undefined || !userId) {
      return sendResponse(res, 400, "score,totalMarks and userId are required");
    }

    const user = await User.findOne({
      where: {
        userId,
        isDeleted: false,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const attempt = await QuizAttempt.create({
      score,
      totalMarks,
      userId,
    });

    return sendResponse(res, 201, "Quiz attempt created", attempt);
  }

  static async updateAttempt(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Attempt id required");
    }

    const { score, totalMarks } = req.body;

    const attempt = await QuizAttempt.findOne({
      where: {
        attemptId: id,
        isDeleted: false,
      },
    });

    if (!attempt) {
      return sendResponse(res, 404, "Attempt not found");
    }

    await attempt.update({
      score,
      totalMarks,
    });

    return sendResponse(res, 200, "Attempt updated successfully", attempt);
  }

  static async getAttempt(req: Request, res: Response) {
    const attempts = await QuizAttempt.findAll({
      where: {
        isDeleted: false,
      },

      include: [
        {
          model: User,
          attributes: ["userId", "name", "email"],
        },
      ],
    });

    if (attempts.length === 0) {
      return sendResponse(res, 404, "No attempts found");
    }

    return sendResponse(res, 200, "Attempts fetched successfully", attempts);
  }

  static async getMyAttempts(req: IRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const attempts = await QuizAttempt.findAll({
        where: { userId, isDeleted: false } as object,
        order: [["createdAt", "DESC"]],
        limit: 20,
      });
      return sendResponse(res, 200, "Your attempts fetched", attempts);
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getLeaderboard(_req: Request, res: Response) {
    try {
      const rows = await QuizAttempt.findAll({
        where: { isDeleted: false },
        attributes: [
          "userId",
          [fn("COUNT", col("attemptId")), "totalAttempts"],
          [fn("MAX", literal(`score * 100 / NULLIF("totalMarks", 0)`)), "bestPct"],
          [fn("SUM", col("score")), "totalScore"],
        ],
        include: [{ model: User, attributes: ["name", "college"] }],
        group: ["QuizAttempt.userId", "User.userId"],
        order: [[literal(`"bestPct"`), "DESC"]],
        limit: 10,
      });
      return sendResponse(res, 200, "Leaderboard fetched", rows);
    } catch (error) {
      console.log("Leaderboard error", error);
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const quiz = await QuizAttempt.findOne({
      where: {
        attemptId: id,
      },
    });

    if (!quiz) {
      return sendResponse(res, 404, "Content not found");
    }

    if (quiz.isDeleted) {
      return sendResponse(res, 400, "Content already blocked");
    }

    quiz.isDeleted = true;

    await quiz.save();

    return sendResponse(res, 200, "Subject blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const quiz = await QuizAttempt.findOne({
      where: {
        attemptId: id,
      },
    });

    if (!quiz) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (!quiz.isDeleted) {
      return sendResponse(res, 400, "Subject is already active");
    }

    quiz.isDeleted = false;

    await quiz.save();

    return sendResponse(res, 200, "Subject unblocked successfully");
  }
}

export default QuizAttemptController;
