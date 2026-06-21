import express from "express"
import QuizController from "../controller/quizController"
import UserMiddleware, { Role } from "../middleware/userMiddleware"

const quizRouter=express.Router()

quizRouter.post("/createquiz",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),QuizController.createQuiz)
quizRouter.get("/getquiz",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),QuizController.getQuiz)
quizRouter.put("/updatequiz/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),QuizController.updateQuiz)
quizRouter.post("/block/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),QuizController.block)
quizRouter.post("/unblock/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),QuizController.unBlock)

export default quizRouter