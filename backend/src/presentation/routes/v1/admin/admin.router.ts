import { Router } from "express";
import { getCurentAdmin, adminLogout } from "@/presentation/controller";

const adminRouter = Router();

adminRouter.get("/logout", adminLogout);
adminRouter.get("/", getCurentAdmin);

export default adminRouter;
