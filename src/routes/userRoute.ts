import express from "express";
import UserController from "../controller/userController";
import UserMiddleware, { Role } from "../middleware/userMiddleware";
import uploadToCloudinary from "../middleware/fileUploadMiddleware";

const userRouter=express.Router();

userRouter.post('/register', uploadToCloudinary.single("profilePhoto"), UserController.register)
userRouter.post('/login',UserController.login)
userRouter.post('/logout',UserMiddleware.isUserLogin,UserController.logout)
userRouter.post('/forgotpassword',UserController.forgotPassword)
userRouter.post('/verifyotp',UserController.verifyOtp)
userRouter.post('/resetpassword',UserController.resetPassword)
userRouter.get('/getuser',UserMiddleware.isUserLogin,UserController.getMe)
userRouter.get('/getalluser',UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),UserController.getAllUser);
userRouter.post('/block/:id',UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),UserController.block)
userRouter.post('/unblock/:id',UserMiddleware.isUserLogin,UserMiddleware.accessTo(Role.Admin),UserController.unBlock)


export default userRouter