import express from "express";
import SubjectController from "../controller/subjectController";
import UserMiddleware, { Role } from "../middleware/userMiddleware";

const subjectRouter = express.Router();

subjectRouter.post(
  "/createsub",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubjectController.addSubject,
);

subjectRouter.put(
  "/updatesub/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubjectController.updateSubject,
);
subjectRouter.get(
  "/getsubject",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubjectController.getSubject,
);
subjectRouter.post(
  "/block/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubjectController.block,
);
subjectRouter.post(
  "/unblock/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubjectController.unBlock,
);

export default subjectRouter;
