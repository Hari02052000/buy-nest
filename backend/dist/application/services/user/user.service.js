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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const entities_1 = require("../../../domain/entities");
class userService {
    constructor(userRepository, authUtills, tokenUtils) {
        this.userRepository = userRepository;
        this.authUtills = authUtills;
        this.tokenUtils = tokenUtils;
    }
    LogoutUser(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userToken)
                throw new entities_1.ValidationError("token not found");
            const tokenProps = this.tokenUtils.isValidUserToken(userToken);
            if (tokenProps.isVerified && tokenProps.payload.id) {
                const user = yield this.userRepository.getUserById(tokenProps.payload.id);
                user.setRefreshToken("");
                const newUser = yield this.userRepository.editUser(user);
                return true;
            }
            throw new entities_1.APIError();
        });
    }
    getCurentUser(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userToken)
                throw new entities_1.ValidationError();
            const tokenProps = this.tokenUtils.isValidUserToken(userToken);
            if (tokenProps.isVerified && tokenProps.payload.id) {
                const user = yield this.userRepository.getUserById(tokenProps.payload.id);
                return user.sanitizeUser();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //cheak the refreshToken valid or not
            const tokenProps = this.tokenUtils.isValidUserToken(refreshToken);
            //get user with userid
            if (tokenProps.isVerified && tokenProps.payload.id) {
                const user = yield this.userRepository.getUserById(tokenProps.payload.id);
                //generate accesstToken and refresh token
                const access_token = this.authUtills.generateAcessToken(user.email, user.id);
                const refresh_token = this.authUtills.generateRefreshToken(user.id);
                return {
                    access_token,
                    refresh_token,
                    user: user.sanitizeUser(),
                };
            }
            throw new entities_1.AuthorizeError();
        });
    }
    registerUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInput = this.authUtills.validateUserRegisterInput(requestBody);
            const existUser = yield this.userRepository.getUserByEmail(userInput.email);
            if (existUser)
                throw new entities_1.ValidationError("email already exist");
            const userName = userInput.email.split("@")[0];
            const salt = yield this.authUtills.getSalt();
            const hashedPassword = yield this.authUtills.getHashedPassword(userInput.password, salt);
            const user = new entities_1.User("", userName, userInput.email, false, undefined, hashedPassword, salt);
            const savedUser = yield this.userRepository.saveUser(user);
            const access_token = this.authUtills.generateAcessToken(savedUser.email, savedUser.id);
            const refresh_token = this.authUtills.generateRefreshToken(savedUser.id);
            savedUser.setRefreshToken(refresh_token);
            //send email want done
            yield this.userRepository.editUser(savedUser);
            return {
                access_token,
                refresh_token,
                user: savedUser.sanitizeUser(),
            };
        });
    }
    loginUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            //cheak the userInput valid or not
            const userInput = this.authUtills.validateUserLoginInput(requestBody);
            //get user with email
            const user = yield this.userRepository.getUserByEmail(userInput.email);
            // find user is google loged or normal register
            if ((user === null || user === void 0 ? void 0 : user.isGoogleProvided) && user.googleId)
                throw new entities_1.ValidationError("you allready registerd by google try google login");
            if (!user)
                throw new entities_1.ValidationError("invalid email or password");
            const isPasswordValid = yield this.authUtills.validatePassword(userInput.password, user.password, user.salt);
            if (!isPasswordValid)
                throw new entities_1.ValidationError("invalid email or password");
            //generate aceess_toekn and refresh_token
            const access_token = this.authUtills.generateAcessToken(user.email, user.id);
            const refresh_token = this.authUtills.generateRefreshToken(user.id);
            user.setRefreshToken(refresh_token);
            yield this.userRepository.editUser(user);
            return {
                access_token,
                refresh_token,
                user: user.sanitizeUser(),
            };
        });
    }
    loginViaGoogle(email, googleId, name, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.getUserByEmail(email);
            if (!user) {
                const newUser = new entities_1.User("", name, email, true, profile, undefined, undefined, googleId);
                user = yield this.userRepository.saveUser(newUser);
            }
            else {
                user.setGoogleId(googleId);
                user.setProfile(profile);
                const updatedUser = yield this.userRepository.editUser(user);
                if (updatedUser)
                    user = updatedUser;
            }
            return user.sanitizeUser();
        });
    }
    googleSucessess(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.id)
                throw new entities_1.ValidationError();
            let userDb = yield this.userRepository.getUserById(user.id);
            const access_token = this.authUtills.generateAcessToken(user.email, user.id);
            const refresh_token = this.authUtills.generateRefreshToken(user.id);
            userDb.setRefreshToken(refresh_token);
            yield this.userRepository.editUser(userDb);
            return {
                access_token,
                refresh_token,
                user: userDb.sanitizeUser(),
            };
        });
    }
}
exports.userService = userService;
