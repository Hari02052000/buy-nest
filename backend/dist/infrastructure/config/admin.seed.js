"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const utils_1 = require("../../infrastructure/utils");
const entities_1 = require("../../domain/entities");
const admin_model_1 = __importDefault(require("../../infrastructure/model/admin.model"));
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield admin_model_1.default.find();
        if (admins.length === 0) {
            const password = "12345678";
            const email = "admin@gmail.com";
            const salt = yield utils_1.authUtills.getSalt();
            const userName = "admin";
            const profile = "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png";
            const hashedPassword = yield utils_1.authUtills.getHashedPassword(password, salt);
            const newAdmin = new admin_model_1.default({
                userName,
                email,
                password: hashedPassword,
                salt,
                profile,
            });
            yield newAdmin.save();
        }
    }
    catch (error) {
        throw new entities_1.APIError();
    }
});
exports.createAdmin = createAdmin;
