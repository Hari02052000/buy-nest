import { Router } from "express";
import { getAddress, createAddress } from "@/presentation/controller";

const addressRouter = Router();

addressRouter.post("/", createAddress);
addressRouter.get("/", getAddress);

export default addressRouter;
