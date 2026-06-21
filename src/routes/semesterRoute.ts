import express from "express";
import SemesterController from "../controller/semesterController";
import UserMiddleware, { Role } from "../middleware/userMiddleware";

const semesterRouter = express.Router();

semesterRouter.post(
  "/createSem",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SemesterController.addSemester,
);
semesterRouter.get(
  "/getSemester",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SemesterController.getSemester,
);

export default semesterRouter;
