import { Request, Response } from "express";
import SavedNote from "../database/model/savedNoteModel";
import Note from "../database/model/noteModel";
import Content from "../database/model/contentModel";
import Subject from "../database/model/subjectModel";
import Semester from "../database/model/semesterModel";
import User from "../database/model/userModel";
import sendResponse from "../service/sendResponse";

interface IRequest extends Request { user?: User }

class SavedNoteController {
  static async save(req: IRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { noteId } = req.body;
      if (!noteId || !userId) return sendResponse(res, 400, "noteId is required");

      const existing = await SavedNote.findOne({ where: { userId, noteId } });
      if (existing) return sendResponse(res, 409, "Note already saved");

      const saved = await SavedNote.create({ userId, noteId });
      return sendResponse(res, 201, "Note saved", saved);
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async unsave(req: IRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { noteId } = req.params;
      if (!userId) return sendResponse(res, 401, "Unauthorized");
      const deleted = await SavedNote.destroy({ where: { userId, noteId } });
      if (!deleted) return sendResponse(res, 404, "Saved note not found");
      return sendResponse(res, 200, "Note removed from saved");
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getMySaved(req: IRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendResponse(res, 401, "Unauthorized");

      const saved = await SavedNote.findAll({
        where: { userId },
        include: [
          {
            model: Note,
            attributes: ["noteId", "topic", "subTopics", "noteFile"],
            include: [
              {
                model: Content,
                attributes: ["contentId", "chapterName", "chapterNumber"],
                include: [
                  {
                    model: Subject,
                    attributes: ["subjectName", "courseCode"],
                    include: [{ model: Semester, attributes: ["semesterNumber"] }],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return sendResponse(res, 200, "Saved notes fetched", saved);
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }
}

export default SavedNoteController;
