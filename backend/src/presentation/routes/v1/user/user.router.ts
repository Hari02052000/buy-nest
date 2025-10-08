import { Router } from "express";
import { getUserProfile, LogOutUser } from "@/presentation/controller";

const userRouter = Router();

userRouter.get("/", getUserProfile);
userRouter.get("/logout", LogOutUser);
//upload profile
//edit profile
//forgot password
//send otp
//verify otp
//change password
export default userRouter;
