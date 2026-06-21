import express from "express";
import SubContentController from "../controller/subContentController";
import UserMiddleware, { Role } from "../middleware/userMiddleware";

const subContentRouter = express.Router();

subContentRouter.post(
  "/createsubcontent",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubContentController.createSubContent,
);
subContentRouter.get(
  "/getsubcontent",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubContentController.getSubContents,
);
subContentRouter.put(
  "/updatesubcontent/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubContentController.updateSubContent,
);
subContentRouter.post(
  "/block/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubContentController.block,
);
subContentRouter.get(
  "/getsubcontentbycontent/:contentId",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubContentController.getSubContentByContent,
);

subContentRouter.post(
  "/unblock/:id",
  UserMiddleware.isUserLogin,
  UserMiddleware.accessTo(Role.Admin),
  SubContentController.unBlock,
);
export default subContentRouter;
