import express from "express";
import QuizAttemptController from "../controller/quizAttemptController";
import UserMiddleware, { Role } from "../middleware/userMiddleware";

const quizAttempt = express.Router();

quizAttempt.post(
  "/createattempt",
  UserMiddleware.isUserLogin,
  QuizAttemptController.createAttempt,
);
quizAttempt.get(
  "/myattempts",
  UserMiddleware.isUserLogin,
  QuizAttemptController.getMyAttempts,
);
quizAttempt.get(
  "/leaderboard",
  QuizAttemptController.getLeaderboard,
);
quizAttempt.get(
  "/getattempt",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizAttemptController.getAttempt,
);
quizAttempt.put(
  "/updateattempt/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizAttemptController.updateAttempt,
);
quizAttempt.post(
  "/block/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizAttemptController.block,
);
quizAttempt.post(
  "/unblock/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuizAttemptController.unBlock,
);

export default quizAttempt;
