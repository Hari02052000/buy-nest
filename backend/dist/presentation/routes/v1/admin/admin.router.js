"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../../presentation/controller");
const adminRouter = (0, express_1.Router)();
adminRouter.get("/logout", controller_1.adminLogout);
adminRouter.get("/", controller_1.getCurentAdmin);
exports.default = adminRouter;
