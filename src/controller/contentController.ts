import { Request, Response } from "express";
import sendResponse from "../service/sendResponse";
import Content from "../database/model/contentModel";
import Subject from "../database/model/subjectModel";

interface IUpdate {
  chapterNumber?: string;
  chapterName?: string;
  subjectId?: string;
}

class ContentController {
  static async createContent(req: Request, res: Response) {
    const { chapterNumber, chapterName, subjectId } = req.body;
    if (!chapterName || !chapterNumber || !subjectId) {
      return sendResponse(res, 403, "ALl fields are mandatory");
    }

    const existChapter = await Content.findOne({
      where: {
        chapterName: chapterName,
      },
    });

    if (existChapter) {
      return sendResponse(res, 400, "Chapter already exists");
    }

    const chapter = await Content.create({
      chapterNumber,
      chapterName,
      subjectId: subjectId,
    });

    return sendResponse(res, 201, "content created successfully");
  }

  static async getContent(req: Request, res: Response) {
    const content = await Content.findAll({
      where: {
        isDeleted: false,
      },include:[
        {
          model:Subject,
          attributes:["subjectName"]
        }
      ]
    });

    return sendResponse(res, 201, "Content fetched successfully", content);
  }

  static async getContentBySubject(req:Request,res:Response){
   
    const {subjectId}=req.params;
    if(!subjectId){
      return sendResponse(res,400,"subjecId not found")
    }

    const content=await Content.findAll({
      where:{
        subjectId,
          isDeleted:false
      },
    
    });

    if(!content){
      return sendResponse(res,403,"content not found")
    }
    return sendResponse(res,200,"Content fetched",content)

  }

  static async updateContent(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }
    const { chapterNumber, chapterName, subjectId } = req.body;

    const chapter = await Content.findOne({
      where: {
        contentId: id,
      },
    });

    if (!chapter) {
      return sendResponse(res, 404, "Content with this ID not fpund");
    }

    const update: IUpdate = {
      chapterNumber,
      chapterName,
      subjectId,
    };

    const updateChpater = await Content.update(update, {
      where: {
        contentId: id,
      },
    });

    return sendResponse(res,201,"Content updated successfully",updateChpater)
  }

  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const content = await Content.findOne({
      where: {
        contentId: id,
      },
    });

    if (!content) {
      return sendResponse(res, 404, "Content not found");
    }

    if (content.isDeleted) {
      return sendResponse(res, 400, "Content already blocked");
    }

    content.isDeleted = true;

    await content.save();

    return sendResponse(res, 200, "Subject blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const content = await Content.findOne({
      where: {
        contentId   : id,
      },
    });

    if (!content) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (!content.isDeleted) {
      return sendResponse(res, 400, "Subject is already active");
    }

    content.isDeleted = false;

    await content.save();

    return sendResponse(res, 200, "Subject unblocked successfully");
  }


}

export default ContentController;
