import express from "express";
import QuizQuestionController from "../controller/quizQuestionController";
import UserMiddleware, { Role } from "../middleware/userMiddleware";
import uploadToCloudinary from "../middleware/fileUploadMiddleware";

const quizQuestionRouter = express.Router();

quizQuestionRouter.post(
  "/create",
  uploadToCloudinary.single("quizquesFile"),
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizQuestionController.createQuizQuestion,
);

quizQuestionRouter.get(
  "/getsingleques/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizQuestionController.getSingleQuestion,
);
quizQuestionRouter.get(
  "/getforuser",
  QuizQuestionController.getQuestionsForUser,
);

quizQuestionRouter.get(
  "/getallquestion",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizQuestionController.getAllQuestion,
);

quizQuestionRouter.put(
  "/updatequizques/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizQuestionController.updateQuizQuestion,
);

quizQuestionRouter.post(
  "/block/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizQuestionController.block,
);

quizQuestionRouter.post(
  "/unblock/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizQuestionController.unBlock,
);

export default quizQuestionRouter;
