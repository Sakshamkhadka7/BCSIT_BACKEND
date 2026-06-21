import { Request, Response } from "express";
import Quiz from "../database/model/quizModel";
import Subject from "../database/model/subjectModel";
import sendResponse from "../service/sendResponse";

class QuizController {
  static async createQuiz(req: Request, res: Response) {
    const { title, totalMarks, duration, subjectId } = req.body;

    if (!title || !totalMarks || !duration || !subjectId) {
      return sendResponse(res, 400, "All fields are required");
    }

    const subject = await Subject.findOne({
      where: {
        subjectId,
        isDeleted: false,
      },
    });

    if (!subject) {
      return sendResponse(res, 404, "Subject not found");
    }

    const existingQuiz = await Quiz.findOne({
      where: {
        title,
        subjectId,
      },
    });

    if (existingQuiz) {
      return sendResponse(res, 400, "Quiz already exists");
    }

    const quiz = await Quiz.create({
      title,
      totalMarks,
      duration,
      subjectId,
    });

    return sendResponse(res, 201, "Quiz created successfully", quiz);
  }

  static async updateQuiz(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Quiz id required");
    }

    const { title, totalMarks, duration } = req.body;

    const quiz = await Quiz.findOne({
      where: {
        quizId: id,
        isDeleted: false,
      },
    });

    if (!quiz) {
      return sendResponse(res, 404, "Quiz not found");
    }

    await quiz.update({
      title,
      totalMarks,
      duration,
    });

    return sendResponse(res, 200, "Quiz updated successfully", quiz);
  }

  static async getQuiz(req: Request, res: Response) {
    const quizzes = await Quiz.findAll({
      where: {
        isDeleted: false,
      },

      include: [
        {
          model: Subject,
          attributes: ["subjectId", "subjectName", "courseCode"],
        },
      ],
    });

    if (quizzes.length === 0) {
      return sendResponse(res, 404, "No quiz found");
    }

    return sendResponse(res, 200, "Quiz fetched successfully", quizzes);
  }


   static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const quiz = await Quiz.findOne({
      where: {
        quizId: id,
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

    const quiz = await Quiz.findOne({
      where: {
        quizId   : id,
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

export default QuizController;
