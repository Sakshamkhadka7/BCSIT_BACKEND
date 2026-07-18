import { CookieOptions, Request, Response } from "express";
import User from "../database/model/userModel";
import sendMail from "../service/sentEmail";
import bcrypt from "bcryptjs";
import generateToken from "../service/generateToken";
import generateOtp from "../service/generateOtp";
import checkOtpExpiration from "../service/verifyOtp";
import sendResponse from "../service/sendResponse";
import { envConfig } from "../config/envConfig";
import uploadResource from "../service/uploadResourceToCloud";

interface UserRequest extends Request {
  user?: User;
}

class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, password, phoneNumber, college } = req.body;
    if (!name || !email || !password || !phoneNumber || !college) {
      res.status(403).json({ message: "All fields are mandatory" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Profile photo is required" });
      return;
    }

    const [data] = await User.findAll({ where: { email } });
    if (data) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    let profilePhotoUrl: string;
    try {
      const uploaded = await uploadResource(req);
      profilePhotoUrl = uploaded.secure_url;
    } catch {
      res.status(500).json({ message: "Failed to upload profile photo" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      phoneNumber,
      college,
      profilePhoto: profilePhotoUrl,
    });

    await sendMail({
      to: email,
      subject: "Register successfully",
      text: "Welcome to BCSIT Hub, You have registered successfully",
    });

    // Auto-login: set the same JWT cookie as the login endpoint so the
    // user doesn't have to sign in again immediately after registering.
    const token = generateToken(user.userId);
    const options: CookieOptions = { httpOnly: true, secure: false, sameSite: "lax" };
    return res.cookie("login_cookie", token, options).status(200).json({
      message: "User created successfully",
      data: user,
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(403).json({
        message: "All fields are required",
      });
      return;
    }
    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });

    console.log("Data of User : ",req.body);

    if (!data) {
      res.status(400).json({
        message: "Email not found please register",
      });
      return;
    } else {
      const checkPassword = await bcrypt.compare(password, data.password);
      if (!checkPassword) {
        res.status(403).json({
          message: "Password is incorrect",
        });
        return;
      } else {
        const token = generateToken(data.userId);
        const options: CookieOptions = {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        };
        console.log("Token of User : ",token);
        res.cookie("login_cookie", token, options).status(200).json({
          message: "User login successfully",
          data,
        });
      }
    }
  }

  static async logout(req: UserRequest, res: Response) {
    const id = req.user?.userId;
    if (!id) {
      return sendResponse(res, 403, "Id not found");
    }

    const user = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };
    return res.status(201).clearCookie("login_cookie", options).json({
      message:"Logout succes"
    });
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res.status(403).json({
        message: "email are required",
      });
      return;
    }
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "Email not found",
      });
      return;
    }

    const otp = generateOtp();

    await sendMail({
      to: email,
      subject: "Change password by BCSIT HUB",
      text: `You reques to change a password ${otp}`,
    });
    user.otp = otp.toString();
    user.otpGenerated = Date.now().toString();

    await user.save();

    res.status(200).json({
      message: "Password Reset OTP sent !!",
    });
  }

  static async verifyOtp(req: Request, res: Response) {
    const { otp, email } = req.body;
    if (!otp || !email) {
      res.status(403).json({
        message: "OTP and email are required",
      });
      return;
    }

    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "Email not valid",
      });
      return;
    }

    const [data] = await User.findAll({
      where: {
        email: email,
        otp: otp,
      },
    });

    if (!data) {
      res.status(403).json({
        message: "Invalid Data",
      });
      return;
    }

    const otpTime = data.otpGenerated;
    checkOtpExpiration(res, otpTime, 120000);
  }

  static async resetPassword(req: Request, res: Response) {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      sendResponse(res, 403, "all fields are required");
    }

    if (newPassword !== confirmPassword) {
      res.status(403).json({
        message: "New password is not match",
      });
      return;
    }

    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "Email not found",
      });
      return;
    }

    user.password = bcrypt.hashSync(newPassword, 12);
    await user.save();
    sendResponse(res, 200, "Password reset successfully");
  }

  static async getMe(req: UserRequest, res: Response) {
    const id = req.user?.userId;
    console.log(id);
    if (!id) {
      return sendResponse(res, 404, "Id not found");
    }

    const user = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found with this id");
    }

    return sendResponse(res, 201, "User fetched", user);
  }

  static async block(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const user = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    if (user.isDeleted) {
      return sendResponse(res, 400, "User already blocked");
    }

    user.isDeleted = true;

    await user.save();

    return sendResponse(res, 200, "User blocked successfully");
  }

  static async unBlock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "Id not found");
    }

    const user = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    if (!user.isDeleted) {
      return sendResponse(res, 400, "User is already active");
    }

    user.isDeleted = false;

    await user.save();

    return sendResponse(res, 200, "User unblocked successfully");
  }

  static async getAllUser(req: Request, res: Response) {
    const user = await User.findAll();
    if (!user) {
      return sendResponse(res, 404, "No user is found");
    }

    return sendResponse(res, 201, "User fetched successfully", user);
  }
}

export default UserController;
