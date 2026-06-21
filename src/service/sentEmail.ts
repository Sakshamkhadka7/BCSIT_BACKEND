import nodemailer from "nodemailer";
import { envConfig } from "../config/envConfig";

interface IData {
  to: string;
  subject: string;
  text: string;
}

const sendMail = async (data: IData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envConfig.email,
      pass: envConfig.password,
    },
  });

  const mailOptions = {
    from: "BCSITHUB<sakshamkhadka>",
    to: data.to,
    subject: data.subject,
    text: data.text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error occured at send mail", error);
  }
};

export default sendMail
