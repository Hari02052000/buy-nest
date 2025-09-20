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
exports.authUtills = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../domain/entities/errors");
const validator_1 = require("./validator");
const environment_1 = require("../../infrastructure/config/environment");
const APP_SCERET = environment_1.env.APP_SCERET || "my secret";
const getSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
const getHashedPassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
const validatePassword = (enterdPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield getHashedPassword(enterdPassword, salt)) === savedPassword;
});
const generateAcessToken = (email, id) => {
    return jsonwebtoken_1.default.sign({
        id,
        email,
    }, APP_SCERET, {
        expiresIn: "15m",
    });
};
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({
        id,
    }, APP_SCERET, {
        expiresIn: "1d",
    });
};
const validateUserLoginInput = (reqBody) => {
    const { error } = validator_1.LoginValidator.validate(reqBody);
    if (error)
        throw new errors_1.ValidationError(error.details[0].message);
    else
        return { email: reqBody.email, password: reqBody.password };
};
const validateUserRegisterInput = (reqBody) => {
    const { error } = validator_1.RegisterValidator.validate(reqBody);
    if (error)
        throw new errors_1.ValidationError(error.details[0].message);
    else
        return { conformPassword: reqBody.conformPassword, email: reqBody.email, password: reqBody.password };
};
const validateAdminLoginInput = (reqBody) => {
    const { error } = validator_1.LoginValidator.validate(reqBody);
    if (error)
        throw new errors_1.ValidationError(error.details[0].message);
    else
        return { email: reqBody.email, password: reqBody.password };
};
exports.authUtills = {
    getSalt,
    getHashedPassword,
    validatePassword,
    generateAcessToken,
    generateRefreshToken,
    validateUserLoginInput,
    validateUserRegisterInput,
    validateAdminLoginInput,
};
