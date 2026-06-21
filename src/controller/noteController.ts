import { Request, Response } from "express";
import sendResponse from "../service/sendResponse";
import Note from "../database/model/noteModel";
import uploadResource from "../service/uploadResourceToCloud";
import Subcontent from "../database/model/subContentModel";
import Content from "../database/model/contentModel";
import Subject from "../database/model/subjectModel";
import Semester from "../database/model/semesterModel";

interface IUpdate {
  topic?: string;
  subTopics?: string;
  contentId?: string;
  noteFile?: string;
}

class NoteController {
  static async createNote(req: Request, res: Response) {
    try {
      const { topic, subTopics, contentId } = req.body;
      console.log(req.body);
      if (!topic || !subTopics || !contentId) {
        return sendResponse(res, 403, "topic and subtopic ,contentId is required");
      }
      const existingNote = await Note.findOne({
        where: { topic, contentId },
      });
      if (existingNote) {
        return sendResponse(res, 400, "Note already exist");
      }

      const clouindaryResult = await uploadResource(req);

      await Note.create({
        topic,
        subTopics,
        contentId,
        noteFile: clouindaryResult.secure_url,
      });

      return sendResponse(res, 201, "Note is created");
    } catch (error) {
      console.log("Error occurred at createNote", error);
      return sendResponse(res, 500, "Server error");
    }
  }

  static async getNote(_req: Request, res: Response) {
    try {
      const notes = await Note.findAll({
        where: { isDeleted: false },
        include: [
          {
            model: Content,
            attributes: ["contentId", "chapterName", "chapterNumber"],
            include: [
              {
                model: Subject,
                attributes: ["subjectId", "subjectName", "courseCode"],
                include: [
                  {
                    model: Semester,
                    attributes: ["semesterId", "semesterNumber"],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          [Content, "chapterNumber", "ASC"],
          ["topic", "ASC"],
        ],
      });

      if (notes.length === 0) {
        return sendResponse(res, 404, "Note is not available");
      }

      return sendResponse(res, 200, "Notes fetched successfully", notes);
    } catch (error) {
      console.log("Error occured at getNote", error);
      return sendResponse(res, 500, "Server error");
    }
  }

  static async updateNote(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }
    const { topic, subTopics, contentId } = req.body;

    const note = await Note.findOne({
      where: {
        noteId: id,
      },
    });

    if (!note) {
      return sendResponse(res, 404, "Note with that Id not found");
    }

    let updatedNote: IUpdate = {
      topic,
      subTopics,
      contentId,
    };

    let fileUrl;
    if (req.file) {
      const cloudinaryResult = await uploadResource(req);
      fileUrl = cloudinaryResult.secure_url;
      updatedNote.noteFile = fileUrl;
    }

    const updateNote = await Note.update(updatedNote, {
      where: {
        noteId: id,
      },
    });

    return sendResponse(res, 201, "Note updated successfully", updateNote);
  }

  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const note = await Note.findOne({
      where: {
        noteId: id,
      },
    });

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    if (note.isDeleted) {
      return sendResponse(res, 400, "Note already blocked");
    }

    note.isDeleted = true;

    await note.save();

    return sendResponse(res, 200, "note blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const note = await Note.findOne({
      where: {
        noteId: id,
      },
    });

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    if (!note.isDeleted) {
      return sendResponse(res, 400, "Note is already active");
    }

    note.isDeleted = false;

    await note.save();

    return sendResponse(res, 200, "Note unblocked successfully");
  }
}

export default NoteController;
