"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../../presentation/controller");
const userRouter = (0, express_1.Router)();
userRouter.get("/", controller_1.getUserProfile);
userRouter.get("/logout", controller_1.LogOutUser);
exports.default = userRouter;
