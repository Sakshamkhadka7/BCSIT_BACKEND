import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/envConfig";
import User from "../database/model/userModel";

export enum Role {
  Admin = "admin",
  User = "user",
}

interface IRequest extends Request {
  user?: User;

  cookies: {
    login_cookie?: string;
  };
}

class UserMiddleware {
  static async isUserLogin(req: IRequest, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.login_cookie;

      if (!token) {
        return res.status(401).json({
          message: "Token not found",
        });
      }

      const decoded = jwt.verify(token, envConfig.secret_token as string) as {
        userId: string;
      };

      const userData = await User.findByPk(decoded.userId);

      if (!userData) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      req.user = userData;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  }

  static accessTo(...roles: Role[]) {
    return (req: IRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!roles.includes(userRole as Role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    };
  }
}

export default UserMiddleware;
