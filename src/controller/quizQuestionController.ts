import { Request, Response } from "express";
import QuizQuestion from "../database/model/quizQuestionModel";
import sendResponse from "../service/sendResponse";
import Quiz from "../database/model/quizModel";
import Subject from "../database/model/subjectModel";
import Semester from "../database/model/semesterModel";
import uploadResource from "../service/uploadResourceToCloud";

class QuizQuestionController {
  static async createQuizQuestion(req: Request, res: Response) {
    try {
      const { question, answer, optionA, optionB, optionC, quizId  } = req.body;



      if (!question || !answer || !optionA || !optionB || !optionC || !quizId) {
        return sendResponse(res, 400, "All fields are required");
      } 
       
      let quizQues:string | null= null
      if(req.file){
        const cloudinaryResult=await uploadResource(req);
        quizQues=cloudinaryResult.secure_url;
      } 

      const quizQuestion = await QuizQuestion.create({
        question,
        answer,
        optionA,
        optionB,
        optionC,
        quizId,
        quizquesFile:quizQues
      });

      return sendResponse(
        res,
        201,
        "Quiz question created successfully",
        quizQuestion,
      );
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getSingleQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const question = await QuizQuestion.findOne({
        where: {
          quizQuestionId: id,
          isDeleted: false,
        },
      });

      if (!question) {
        return sendResponse(res, 404, "Question not found");
      }

      return sendResponse(res, 200, "Question fetched", question);
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }


  static async getQuestionsForUser(_req: Request, res: Response) {
    try {
      const questions = await QuizQuestion.findAll({
        where: { isDeleted: false },
        include: [
          {
            model: Quiz,
            attributes: ["title", "subjectId"],
            include: [
              {
                model: Subject,
                attributes: ["subjectName"],
                include: [
                  {
                    model: Semester,
                    attributes: ["semesterNumber"],
                  },
                ],
              },
            ],
          },
        ],
      });
      return sendResponse(res, 200, "Quiz questions fetched", questions);
    } catch (error) {
      console.log("Error at getQuestionsForUser", error);
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getAllQuestion(req:Request,res:Response){
   const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10 ;

    const offset=(page - 1) * limit

    const quiz=await QuizQuestion.findAndCountAll({
      where:{
        isDeleted:false
      },include:[
        {
          model:Quiz,
          attributes:["title","totalMarks","duration"]
        }
      ],
      limit,
      offset,
      order:[["createdAt","DESC"]]
    })

    return sendResponse(res,201,"Pagination fetched successfullt",quiz)

  }

  static async updateQuizQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { question, answer, optionA, optionB, optionC } = req.body;

      const existing = await QuizQuestion.findOne({
        where: {
          quizQuestionId: id,
          isDeleted: false,
        },
      });

      if (!existing) {
        return sendResponse(res, 404, "Question not found");
      }

      await QuizQuestion.update(
        {
          question,
          answer,
          optionA,
          optionB,
          optionC,
        },

        {
          where: {
            quizQuestionId: id,
          },
        },
      );

      return sendResponse(res, 200, "Question updated successfully");
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  // Soft delete

  static async block(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await QuizQuestion.update(
        {
          isDeleted: true,
        },

        {
          where: {
            quizQuestionId: id,
          },
        },
      );

      return sendResponse(res, 200, "Question deleted successfully");
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const quizQuestion = await QuizQuestion.findOne({
      where: {
        quizQuestionId: id,
      },
    });

    if (!quizQuestion) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (!quizQuestion.isDeleted) {
      return sendResponse(res, 400, "Subject is already active");
    }

    quizQuestion.isDeleted = false;

    await quizQuestion.save();

    return sendResponse(res, 200, "Subject unblocked successfully");
  }
}

export default QuizQuestionController;
