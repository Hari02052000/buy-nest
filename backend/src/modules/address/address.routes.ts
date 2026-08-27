import { Router } from "express";
import { container } from "tsyringe";
import { ADDRESS_TOKENS } from "./address.tokens";
import { AddressController } from "./address.controller";
import { authenticateUser } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<AddressController>(ADDRESS_TOKENS.Controller);

router.post("/", authenticateUser, controller.createAddress);
router.get("/", authenticateUser, controller.getAddresses);
router.get("/:id", authenticateUser, controller.getAddressById);
router.put("/:id", authenticateUser, controller.updateAddress);
router.delete("/:id", authenticateUser, controller.deleteAddress);

export default router;
