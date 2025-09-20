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
exports.adminService = void 0;
const entities_1 = require("../../../domain/entities");
class adminService {
    constructor(adminRepo, tokenUtils, authUtils) {
        this.adminRepo = adminRepo;
        this.tokenUtils = tokenUtils;
        this.authUtils = authUtils;
    }
    logOutAdmin(admin_token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin_token)
                throw new entities_1.ValidationError("token not found");
            const tokenProps = this.tokenUtils.isValidAdminToken(admin_token);
            if (tokenProps.isVerified && tokenProps.payload.id) {
                const admin = yield this.adminRepo.getAdminById(tokenProps.payload.id);
                admin.setRefreshToken("");
                const newAdmin = yield this.adminRepo.editAdmin(admin);
                return newAdmin.sanitizeAdmin();
            }
            throw new entities_1.APIError();
        });
    }
    getcurentAdmin(admin_token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin_token)
                throw new entities_1.ValidationError("token not found");
            const tokenProps = this.tokenUtils.isValidAdminToken(admin_token);
            if (tokenProps.isVerified && tokenProps.payload.id) {
                const admin = yield this.adminRepo.getAdminById(tokenProps.payload.id);
                return admin.sanitizeAdmin();
            }
            throw new entities_1.APIError();
        });
    }
    loginAdmin(RequestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const Input = this.authUtils.validateAdminLoginInput(RequestBody);
            const admin = yield this.adminRepo.getAdminByEmail(Input.email);
            if (!admin)
                throw new entities_1.ValidationError("invalid email or password");
            const isPasswordValid = yield this.authUtils.validatePassword(Input.password, admin.password, admin.salt);
            if (!isPasswordValid)
                throw new entities_1.ValidationError("invalid email or password");
            const access_token = this.authUtils.generateAcessToken(admin.email, admin.id);
            const refresh_token = this.authUtils.generateRefreshToken(admin.id);
            admin.setRefreshToken(refresh_token);
            yield this.adminRepo.editAdmin(admin);
            return {
                access_token,
                refresh_token,
                admin: admin.sanitizeAdmin(),
            };
        });
    }
    adminRefreshToken(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenProps = this.tokenUtils.isValidAdminToken(refresh_token);
            if (tokenProps.isVerified && tokenProps.payload.id) {
                const admin = yield this.adminRepo.getAdminById(tokenProps.payload.id);
                const access_token = this.authUtils.generateAcessToken(admin.email, admin.id);
                const refresh_token = this.authUtils.generateRefreshToken(admin.id);
                return {
                    access_token,
                    refresh_token,
                    admin: admin.sanitizeAdmin(),
                };
            }
            throw new entities_1.AuthorizeError();
        });
    }
}
exports.adminService = adminService;
