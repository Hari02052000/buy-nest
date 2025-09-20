import { Router } from "express";
import { userRefreshToken } from "../../controller/auth/auth.controller";
// Add this route if it doesn't exist
const router = Router();
router.post("/refresh-token", userRefreshToken);
