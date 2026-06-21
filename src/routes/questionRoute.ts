import express from "express";
import QuestionController from "../controller/questionController";
import uploadToCloudinary from "../middleware/fileUploadMiddleware";
import UserMiddleware, { Role } from "../middleware/userMiddleware";

const questionRoute = express.Router();

questionRoute.post(
  "/addQuestion",
  uploadToCloudinary.single("question"),
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuestionController.createQuestion,
);
questionRoute.get("/getQuestion", QuestionController.getQuestion);
questionRoute.put(
  "/updateQuestion/:id",
  uploadToCloudinary.single("question"),
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuestionController.updateQuestion,
);
questionRoute.post(
  "/block/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuestionController.block,
);
questionRoute.post(
  "/unblock/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  QuestionController.unBlock,
);

export default questionRoute;
