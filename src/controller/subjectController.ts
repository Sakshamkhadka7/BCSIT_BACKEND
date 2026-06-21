import { Request, Response } from "express";
import sendResponse from "../service/sendResponse";
import Subject from "../database/model/subjectModel";
import User from "../database/model/userModel";
import Semester from "../database/model/semesterModel";

interface UserRequest extends Request {
  user?: User;
}


class SubjectController {
  static async addSubject(req: UserRequest, res: Response) {
    try {
      console.log("User login :: ",req.user);
      const { courseCode, subjectName, totalCredit, semesterId } = req.body;
      if (!courseCode || !subjectName || !totalCredit || !semesterId) {
        return sendResponse(res, 403, "All fields are mandatory");
      }

      const subjectExist = await Subject.findOne({
        where: {
          courseCode,
        },
      });
      if (subjectExist) {
        return sendResponse(res, 403, "Subject is already exists");
      }

      const subject = await Subject.create({
        courseCode,
        subjectName,
        totalCredit,
        semesterId: semesterId,
      });
      console.log("Subject is created",subject);

      return sendResponse(res, 201, "Subject created successfully");
    } catch (error) {
      console.log("Error occured at addSubject", error);
    }
  }

  static async updateSubject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendResponse(res, 400, "Id not found");
      }
      const { courseCode, subjectName, totalCredit, semesterId } = req.body;

      const subject = await Subject.findOne({
        where: {
          subjectId: id,
        },
      });

      if (!subject) {
        return sendResponse(res, 404, "Subject with this id is not found");
      }

      const update = await Subject.update(
        {
          courseCode,
          subjectName,
          totalCredit,
          semesterId,
        },
        {
          where: {
            subjectId: id,
          },
        },
      );

      return sendResponse(res, 200, "Subject updated successfully", update);
    } catch (error) {
      console.log("Error occurred at updateSubject", error);
      return sendResponse(res, 500, "Internal server error");
    }
  }

  static async getSubject(req: Request, res: Response) {
    try {
      const subject = await Subject.findAll({
        where:{
          isDeleted:false
        },include:[
          {
            model:Semester,
            attributes:["semesterNumber"]
          }
        ]
      });
      if (subject.length === 0) {
        return sendResponse(res, 404, "Subject is not available");
      }
      return sendResponse(res, 200, "Subject fetched successfully", subject);
    } catch (error) {
      console.log("Error occurred at getSubject", error);
      return sendResponse(res, 500, "Internal server error");
    }
  }

  static async deleteSubject(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const subject = await Subject.findOne({
      where: {
        subjectId: id,
      },
    });

    if (!subject) {
      return sendResponse(res, 404, "Subject with that id not found");
    } else {
      await Subject.destroy({
        where: {
          subjectId: id,
        },
      });
      return sendResponse(res, 201, "Subject deleted successfully");
    }
  }
  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const subject = await Subject.findOne({
      where: {
        subjectId: id,
      },
    });

    if (!subject) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (subject.isDeleted) {
      return sendResponse(res, 400, "Subject already blocked");
    }

    subject.isDeleted = true;

    await subject.save();

    return sendResponse(res, 200, "Subject blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const subject = await Subject.findOne({
      where: {
        subjectId: id,
      },
    });

    if (!subject) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (!subject.isDeleted) {
      return sendResponse(res, 400, "Subject is already active");
    }

    subject.isDeleted = false;

    await subject.save();

    return sendResponse(res, 200, "Subject unblocked successfully");
  }
}

export default SubjectController;
