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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const environment_1 = require("./environment");
const services_1 = require("../../application/services");
const repository_1 = require("../../infrastructure/repository");
const utils_1 = require("../../infrastructure/utils");
const token_utils_1 = require("../../infrastructure/utils/token.utils");
const entities_1 = require("../../domain/entities");
const userRepo = new repository_1.userRepository();
const userServ = new services_1.userService(userRepo, utils_1.authUtills, token_utils_1.tokenUtils);
console.log(environment_1.env.google_callback_url);
if (!environment_1.env.google_client_id || !environment_1.env.google_client_secret || !environment_1.env.google_callback_url) {
    throw new Error("dot env not have google ids");
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: environment_1.env.google_client_id,
    clientSecret: environment_1.env.google_client_secret,
    callbackURL: environment_1.env.google_callback_url,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!profile.emails || profile.emails.length === 0) {
            throw new entities_1.ValidationError("Google account has no email associated");
        }
        const user = yield userServ.loginViaGoogle(profile.emails[0].value, profile.id, profile.displayName, profile._json.picture);
        done(null, user);
    }
    catch (error) {
        done(new entities_1.ValidationError("google login faild try again conform emails are present with google account"));
    }
})));
exports.default = passport_1.default;
