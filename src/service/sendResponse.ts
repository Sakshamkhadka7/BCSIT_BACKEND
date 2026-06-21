import { Response } from "express"

const sendResponse = (
  res: Response,
  statusNumber: number,
  message: string,
  data: any = null
) => {

  res.status(statusNumber).json({
    message,
    data
  });

};

export default sendResponse