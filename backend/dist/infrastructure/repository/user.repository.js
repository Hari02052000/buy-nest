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
exports.userRepository = void 0;
const entities_1 = require("../../domain/entities");
const user_model_1 = __importDefault(require("../model/user.model"));
class userRepository {
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userDb;
                if (user.isGoogleProvided && user.googleId) {
                    userDb = new user_model_1.default({
                        userName: user.userName,
                        email: user.email,
                        isGoogleProvided: true,
                        googleId: user.googleId,
                        profile: user.profile,
                    });
                }
                else {
                    userDb = new user_model_1.default({
                        userName: user.userName,
                        email: user.email,
                        password: user.password,
                        salt: user.salt,
                    });
                }
                yield userDb.save();
                return this.mapToUser(userDb);
            }
            catch (error) {
                console.log(error);
                throw new entities_1.APIError();
            }
        });
    }
    editUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedFields = user.modifiedFields;
                if (Object.keys(modifiedFields).length === 0)
                    throw new entities_1.ValidationError();
                const updatedFields = {};
                for (const key in modifiedFields) {
                    if (modifiedFields.hasOwnProperty(key)) {
                        const fieldKey = key;
                        if (modifiedFields[fieldKey]) {
                            updatedFields[fieldKey] = user[fieldKey];
                        }
                    }
                }
                if (updatedFields.updatedAt)
                    delete updatedFields.updatedAt;
                yield user_model_1.default.findByIdAndUpdate(user.id, updatedFields);
                user.clearModifiedFields;
                const updatedUser = yield this.getUserById(user.id);
                return updatedUser;
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDb = yield user_model_1.default.findById(userId);
                if (!userDb)
                    throw new entities_1.ValidationError();
                return this.mapToUser(userDb);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDb = yield user_model_1.default.findOne({ email });
                if (!userDb)
                    return null;
                return this.mapToUser(userDb);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getAllUsers(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.find().skip(skip).limit(limit);
                return users.map((user) => this.mapToUser(user));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    mapToUser(userDbEntity) {
        const user = new entities_1.User(userDbEntity.id, userDbEntity.userName, userDbEntity.email, userDbEntity.isGoogleProvided, userDbEntity.profile, userDbEntity.password, userDbEntity.salt);
        user.isEmailVerified = userDbEntity.isEmailVerified;
        user.refresh_token = userDbEntity.refresh_token;
        user.otp = userDbEntity.otp;
        user.googleId = userDbEntity.googleId;
        user.otpExp = userDbEntity.otpExp;
        user.createdAt = userDbEntity.createdAt;
        user.updatedAt = userDbEntity.updatedAt;
        return user;
    }
}
exports.userRepository = userRepository;
