import { Request, Response } from "express";
import Syllabus from "../database/model/syllabusModel";
import Subject from "../database/model/subjectModel";
import Semester from "../database/model/semesterModel";
import sendResponse from "../service/sendResponse";
import uploadResource from "../service/uploadResourceToCloud";

interface IUpdateSyllabus {
  syllabusName?: string;
  syllabusFile?: string;
  subjectId?: string;
  creditHours?: number;
  unit?: number;
}

class SyllabusController {
  static async createSyllabus(req: Request, res: Response) {
    try {
      const { syllabusName, subjectId, creditHours, unit } = req.body;

      if (!syllabusName || !subjectId || !creditHours || !unit) {
        return sendResponse(res, 400, "Syllabus name and subjectId is required");
      }

      if (!req.file) {
        return sendResponse(res, 400, "Syllabus file is required");
      }

      const existingSyllabus = await Syllabus.findOne({
        where: {
          syllabusName,
          isDeleted: false,
        },
      });

      if (existingSyllabus) {
        return sendResponse(res, 400, "Syllabus already exists");
      }

      const cloudinaryResult = await uploadResource(req);

      const syllabus = await Syllabus.create({
        syllabusName,
        subjectId,
        creditHours: parseInt(creditHours, 10),
        unit: parseInt(unit, 10),
        syllabusFile: cloudinaryResult.secure_url,
      });

      return sendResponse(res, 201, "Syllabus created successfully", syllabus);
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getSyllabus(_req: Request, res: Response) {
    try {
      const syllabus = await Syllabus.findAll({
        where: { isDeleted: false },
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
        order: [["createdAt", "DESC"]],
      });

      if (!syllabus.length) {
        return sendResponse(res, 404, "Syllabus not available");
      }

      return sendResponse(res, 200, "Syllabus fetched successfully", syllabus);
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getSyllabusBySubject(req: Request, res: Response) {
    const { subjectId } = req.params;
    if (!subjectId) {
      return sendResponse(res, 403, "subject id is not found");
    }

    const syllabus = await Syllabus.findOne({
      where: {
        subjectId,
      },
    });

    if (!syllabus) {
      return sendResponse(res, 404, "No syllabus with this id found");
    }

    return sendResponse(res, 201, "syllabus fetched successfully", syllabus);
  }

  static async updateSyllabus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(res, 400, "Id not found");
      }

      const syllabus = await Syllabus.findOne({
        where: {
          syallabusId: id,
        },
      });

      if (!syllabus) {
        return sendResponse(res, 404, "Syllabus not found");
      }

      const { syllabusName, subjectId, creditHours, unit } = req.body;

      const updatedData: IUpdateSyllabus = {
        syllabusName,
        subjectId,
        ...(creditHours && { creditHours: parseInt(creditHours, 10) }),
        ...(unit && { unit: parseInt(unit, 10) }),
      };

      if (req.file) {
        const cloudinaryResult = await uploadResource(req);
        updatedData.syllabusFile = cloudinaryResult.secure_url;
      }

      await Syllabus.update(updatedData, {
        where: {
          syallabusId: id,
        },
      });

      return sendResponse(res, 200, "Syllabus updated successfully");
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const syllabus = await Syllabus.findOne({
      where: {
        syallabusId: id,
      },
    });

    if (!syllabus) {
      return sendResponse(res, 404, "Syllabus not found");
    }

    if (syllabus.isDeleted) {
      return sendResponse(res, 400, "Syllabus already blocked");
    }

    syllabus.isDeleted = true;

    await syllabus.save();

    return sendResponse(res, 200, "Syllabus blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const syllabus = await Syllabus.findOne({
      where: {
        syallabusId: id,
      },
    });

    if (!syllabus) {
      return sendResponse(res, 404, "Syllabus not found");
    }

    if (!syllabus.isDeleted) {
      return sendResponse(res, 400, "Syllabus already active");
    }

    syllabus.isDeleted = false;

    await syllabus.save();

    return sendResponse(res, 200, "Syllabus unblocked successfully");
  }
}

export default SyllabusController;
