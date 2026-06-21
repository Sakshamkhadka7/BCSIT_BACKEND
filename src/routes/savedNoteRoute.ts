import express from "express";
import SavedNoteController from "../controller/savedNoteController";
import UserMiddleware from "../middleware/userMiddleware";

const savedNoteRouter = express.Router();

savedNoteRouter.post("/save",       UserMiddleware.isUserLogin, SavedNoteController.save);
savedNoteRouter.delete("/unsave/:noteId", UserMiddleware.isUserLogin, SavedNoteController.unsave);
savedNoteRouter.get("/mysaved",     UserMiddleware.isUserLogin, SavedNoteController.getMySaved);

export default savedNoteRouter;
