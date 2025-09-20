"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUtils = void 0;
const entities_1 = require("../../domain/entities");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const environment_1 = require("../../infrastructure/config/environment");
const APP_SCERET = environment_1.env.APP_SCERET || "my secret";
const isValidUserToken = (token) => {
    try {
        if (!token)
            throw new entities_1.AuthorizeError("token not found");
        const payload = jsonwebtoken_1.default.verify(token, APP_SCERET);
        return { isVerified: true, payload };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new entities_1.AuthorizeError("token expired");
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new entities_1.AuthorizeError("invalid token");
        }
        throw new entities_1.AuthorizeError();
    }
};
const isValidAdminToken = (token) => {
    try {
        if (!token)
            throw new entities_1.AuthorizeError("token not found");
        const payload = jsonwebtoken_1.default.verify(token, APP_SCERET);
        return { isVerified: true, payload };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new entities_1.AuthorizeError("admin token expired");
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new entities_1.AuthorizeError("invalid token");
        }
        throw new entities_1.AuthorizeError();
    }
};
exports.tokenUtils = {
    isValidAdminToken,
    isValidUserToken,
};
