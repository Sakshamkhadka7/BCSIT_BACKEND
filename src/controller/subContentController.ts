import { Request, Response } from "express";
import Subcontent from "../database/model/subContentModel";
import sendResponse from "../service/sendResponse";
import Content from "../database/model/contentModel";


class SubContentController {
  async createSubContent(req: Request, res: Response) {
    try {
      const { topicName, topicOrder, contentId } = req.body;

      const subContent = await Subcontent.create({
        topicName,
        topicOrder,
        contentId
      });

      res.status(201).json({
        message: "Subcontent created successfully",
        data: subContent
      });

    } catch (error) {
      res.status(500).json({
        message: "Error creating subcontent",
        error
      });
    }
  }

  async getSubContents(req: Request, res: Response) {
    try {

      const subContents = await Subcontent.findAll({
        where:{
          isDeleted:false
        },include:[
          {
            model:Content,
            attributes:["chapterName"]
          }
        ]
      });

      res.status(200).json({
        data: subContents
      });

    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcontents",
        error
      });
    }
  }
  async getSubContent(req: Request, res: Response) {
    try {

      const { id } = req.params;

      const subContent = await Subcontent.findOne(
        {
            where:{
                subContentId:id
            }
        }
      )


      if (!subContent) {
        res.status(404).json({
          message: "Subcontent not found"
        });
        return;
      }


      res.status(200).json({
        data: subContent
      });


    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcontent",
        error
      });
    }
  }

  async getSubContentByContent(req:Request,res:Response){
    const {contentId}=req.params;
    if(!contentId){
      return sendResponse(res,400,"contentId not found")
    }

    const subContent=await Subcontent.findAll({
      where:{
        contentId,
        isDeleted:false
      }
    })
    
    if(!subContent){
      return sendResponse(res,404,"No subContent found with this id")
    }

    return sendResponse(res,201,"subContent fetched",subContent)
  }

  async updateSubContent(req: Request, res: Response) {
    try {

      const { id } = req.params;

      const { topicName, topicOrder } = req.body;


      const subContent = await Subcontent.findOne(
        {
            where:{
                subContentId:id
            }
        }
      )


      if (!subContent) {
        res.status(404).json({
          message: "Subcontent not found"
        });
        return;
      }


      await subContent.update({
        topicName,
        topicOrder
      });


      res.status(200).json({
        message: "Subcontent updated",
        data: subContent
      });


    } catch (error) {

      res.status(500).json({
        message: "Error updating subcontent",
        error
      });

    }
  }

   async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const subcontent = await Subcontent.findOne({
      where: {
        subContentId: id,
      },
    });

    if (!subcontent) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (subcontent.isDeleted) {
      return sendResponse(res, 400, "Subject already blocked");
    }

    subcontent.isDeleted = true;

    await subcontent.save();

    return sendResponse(res, 200, "Subject blocked successfully");
  }

   async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const subcontent = await Subcontent.findOne({
      where: {
        subContentId: id,
      },
    });

    if (!subcontent) {
      return sendResponse(res, 404, "Subject not found");
    }

    if (!subcontent.isDeleted) {
      return sendResponse(res, 400, "Subject is already active");
    }

    subcontent.isDeleted = false;

    await subcontent.save();

    return sendResponse(res, 200, "Subject unblocked successfully");
  }

  

}


export default new SubContentController();