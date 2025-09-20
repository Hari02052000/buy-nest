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
exports.adminRepository = void 0;
const entities_1 = require("../../domain/entities");
const admin_model_1 = __importDefault(require("../model/admin.model"));
class adminRepository {
    saveAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admindb = new admin_model_1.default({
                    userName: admin.userName,
                    email: admin.email,
                    password: admin.password,
                    salt: admin.salt,
                });
                yield admindb.save();
                return this.mapToAdmin(admindb);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    editAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedFields = admin.modifiedFields;
                if (Object.keys(modifiedFields).length === 0)
                    throw new entities_1.ValidationError();
                const updatedFields = {};
                for (const key in modifiedFields) {
                    if (modifiedFields.hasOwnProperty(key)) {
                        const fieldKey = key;
                        if (modifiedFields[fieldKey]) {
                            updatedFields[fieldKey] = admin[fieldKey];
                        }
                    }
                }
                if (updatedFields.updatedAt)
                    delete updatedFields.updatedAt;
                yield admin_model_1.default.findByIdAndUpdate(admin.id, updatedFields);
                admin.clearModifiedFields;
                const updatedAdmin = yield this.getAdminById(admin.id);
                return updatedAdmin;
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getAdminById(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield admin_model_1.default.findById(adminId);
                if (!admin)
                    throw new entities_1.ValidationError();
                return this.mapToAdmin(admin);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield admin_model_1.default.findOne({ email });
                if (!admin)
                    return null;
                return this.mapToAdmin(admin);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    getAllAdmins(skip, limit) {
        throw new Error("Method not implemented.");
    }
    mapToAdmin(adminDbEntity) {
        const admin = new entities_1.Admin(adminDbEntity.id, adminDbEntity.userName, adminDbEntity.email, adminDbEntity.password, adminDbEntity.salt);
        admin.profile = adminDbEntity.profile;
        admin.refresh_token = adminDbEntity.refresh_token;
        admin.createdAt = adminDbEntity.createdAt;
        admin.updatedAt = adminDbEntity.updatedAt;
        return admin;
    }
}
exports.adminRepository = adminRepository;
