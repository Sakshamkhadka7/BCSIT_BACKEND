import { Request, Response } from "express";
import sendResponse from "../service/sendResponse";
import Semester from "../database/model/semesterModel";

class SemesterController {
  static async addSemester(req: Request, res: Response) {
    try {
      const { semesterNumber } = req.body;

      if (!semesterNumber) {
        return sendResponse(res, 400, "Semester number is required");
      }

      const existingSemester = await Semester.findOne({
        where: {
          semesterNumber,
        },
      });

      if (existingSemester) {
        return sendResponse(res, 400, "Semester already exists");
      }

      const semester = await Semester.create({
        semesterNumber,
      });

      return sendResponse(res, 201, "Semester created successfully", semester);
    } catch (error) {
      return sendResponse(res, 500, "Something went wrong");
    }
  }

  static async getSemester(req: Request, res: Response){
    
  try {
      const semester=await Semester.findAll();
      if(semester.length < 0){
        return sendResponse(res,400,"Smester is not available")
      }
  
      return sendResponse(res,201,"semester fetched successfully",semester)
      
  } catch (error) {
    console.log("Error occured at getSemester",error);
  }

  }
}

export default SemesterController;
