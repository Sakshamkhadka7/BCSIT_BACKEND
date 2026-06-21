import express from "express"
import ContentController from "../controller/contentController"
import UserMiddleware, { Role } from "../middleware/userMiddleware"

const contentRouter=express.Router()

contentRouter.post("/createcontent",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),ContentController.createContent)
contentRouter.get("/getcontent",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),ContentController.getContent)
contentRouter.put("/updatecontent/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),ContentController.updateContent)
contentRouter.post("/block/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),ContentController.block)
contentRouter.post("/unblock/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),ContentController.unBlock)
contentRouter.get("getcontentbysub/:subjectId",UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),ContentController.getContentBySubject)

export default contentRouter