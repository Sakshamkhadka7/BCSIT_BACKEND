import express from "express";
import UserMiddleware, { Role } from "../middleware/userMiddleware";
import SyllabusController from "../controller/syllabusController";
import uploadToCloudinary from "../middleware/fileUploadMiddleware";

const syllabusRouter=express.Router();

syllabusRouter.post("/createsyllabus",uploadToCloudinary.single("syllabus"),UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),SyllabusController.createSyllabus)
syllabusRouter.get("/getsyllabus", SyllabusController.getSyllabus)
syllabusRouter.get("/getsyllabusbysubject/:subjectId",UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),SyllabusController.getSyllabusBySubject)
syllabusRouter.post("/block/:id",UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),SyllabusController.block)
syllabusRouter.post("/unblock/:id",UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),SyllabusController.unBlock)
syllabusRouter.put("/updatesyllabus/:id",uploadToCloudinary.single("syllabus"),UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),SyllabusController.updateSyllabus)


export default syllabusRouter;