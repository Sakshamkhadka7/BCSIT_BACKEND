import express from "express"
import NoteController from "../controller/noteController"
import uploadToCloudinary from "../middleware/fileUploadMiddleware"
import UserMiddleware, { Role } from "../middleware/userMiddleware"

const noteRouter=express.Router()
 
noteRouter.post("/addnote",uploadToCloudinary.single("note"),UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),NoteController.createNote)
noteRouter.get("/getNote",NoteController.getNote)
noteRouter.put("/updateNote/:id",uploadToCloudinary.single("note"),UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),NoteController.updateNote)
noteRouter.post("/block/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),NoteController.block)
noteRouter.post("/unblock/:id",UserMiddleware.isUserLogin , UserMiddleware.accessTo(Role.Admin),NoteController.unBlock)

export default noteRouter