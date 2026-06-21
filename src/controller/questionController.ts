import { Request, Response } from "express";
import sendResponse from "../service/sendResponse";
import Question from "../database/model/questionModel";
import uploadResource from "../service/uploadResourceToCloud";

interface IUpdate {
  subjectQuestion?: string;
  questionYear?: string;
  subjectId?: string;
  questionFile?: string;
}

class QuestionController {
  static async createQuestion(req: Request, res: Response) {
    let { subjectQuestion, questionYear, subjectId } = req.body;
    if (!subjectQuestion || !questionYear || !subjectId) {
      return sendResponse(res, 403, "All fields are required");
    }
    questionYear = Number(questionYear);

    const existQuestion = await Question.findOne({
      where: {
        questionYear: questionYear,
      },
    });
    if (existQuestion) {
      return sendResponse(res, 400, "This year question is already existed");
    }
    const cloudinaryResult = await uploadResource(req);

    const question = await Question.create({
      subjectQuestion,
      questionYear: questionYear,
      subjectId,
      questionFile: cloudinaryResult.secure_url,
    });

    return sendResponse(res, 201, "Question is created successfully", question);
  }

  static async getSingleQuestion(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 403, "Id not found");
    }
    const singleQuestion = await Question.findOne({
      where: {
        questionId: id,
      },
    });

    if (!singleQuestion) {
      return sendResponse(res, 404, "Question not found with this Id");
    }

    return sendResponse(res, 201, "Single question fetched", singleQuestion);
  }

  static async getQuestion(req: Request, res: Response) {
    const question = await Question.findAll({
      where: {
        isDeleted: false,
      },
    });
    if (question.length === 0) {
      return sendResponse(res, 404, "Question is not available");
    }

    return sendResponse(res, 201, "Question fetched successfully", question);
  }

  static async updateQuestion(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }
    let { subjectQuestion, questionYear, subjectId } = req.body;

    const question = await Question.findOne({
      where: {
        questionId: id,
      },
    });

    if (!question) {
      return sendResponse(res, 404, "No question found with that ID");
    }

    const update: IUpdate = {
      subjectQuestion,
      questionYear,
      subjectId,
    };

    let fileUrl;
    if (req.file) {
      const cloudinaryResult = await uploadResource(req);
      fileUrl = cloudinaryResult.secure_url;
      update.questionFile = fileUrl;
    }

    const updatedQuestion = await Question.update(update, {
      where: {
        questionId: id,
      },
    });

    return sendResponse(
      res,
      201,
      "QuestionUpdated Successfully",
      updatedQuestion,
    );
  }

  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const question = await Question.findOne({
      where: {
        questionId: id,
      },
    });

    if (!question) {
      return sendResponse(res, 404, "Question not found");
    }

    if (question.isDeleted) {
      return sendResponse(res, 400, "Question already blocked");
    }

    question.isDeleted = true;

    await question.save();

    return sendResponse(res, 200, "Question blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const question = await Question.findOne({
      where: {
        questionId: id,
      },
    });

    if (!question) {
      return sendResponse(res, 404, "Question not found");
    }

    if (!question.isDeleted) {
      return sendResponse(res, 400, "Question is already active");
    }

    question.isDeleted = false;

    await question.save();

    return sendResponse(res, 200, "Question unblocked successfully");
  }
}

export default QuestionController;
