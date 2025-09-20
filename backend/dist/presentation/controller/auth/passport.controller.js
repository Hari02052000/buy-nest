"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLoginMiddleware = exports.googleLogin = void 0;
const passport_config_1 = __importDefault(require("../../../infrastructure/config/passport.config"));
exports.googleLogin = passport_config_1.default.authenticate("google", {
    scope: ["profile", "email"],
});
exports.googleLoginMiddleware = passport_config_1.default.authenticate("google", {
    session: false,
    failWithError: true,
});
