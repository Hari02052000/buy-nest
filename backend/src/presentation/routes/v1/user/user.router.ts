import { Router } from "express";
import { getUserProfile, LogOutUser } from "@/presentation/controller";

const userRouter = Router();

userRouter.get("/", getUserProfile);
userRouter.get("/logout", LogOutUser);

export default userRouter;
