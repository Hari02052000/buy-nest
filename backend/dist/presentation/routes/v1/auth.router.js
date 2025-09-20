"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controller/auth/auth.controller");
// Add this route if it doesn't exist
const router = (0, express_1.Router)();
router.post("/refresh-token", auth_controller_1.userRefreshToken);
