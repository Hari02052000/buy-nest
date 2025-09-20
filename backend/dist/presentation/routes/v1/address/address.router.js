"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../../presentation/controller");
const addressRouter = (0, express_1.Router)();
addressRouter.post("/", controller_1.createAddress);
addressRouter.get("/", controller_1.getAddress);
exports.default = addressRouter;
