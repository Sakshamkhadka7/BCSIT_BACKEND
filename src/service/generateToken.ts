import jwt from "jsonwebtoken";
import { envConfig } from "../config/envConfig";

const generateToken = (userId: string) => {
  const token = jwt.sign(
    {
      userId,
    },
    envConfig.secret_token as string,
    {
      expiresIn: "4d",
    },
  );

  return token;
};

export default generateToken
