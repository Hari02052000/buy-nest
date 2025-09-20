"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.NotFoundError = exports.AuthorizeError = exports.ForbiddenError = exports.ValidationError = exports.APIError = void 0;
const status_code_1 = require("./status.code");
class BaseError extends Error {
    constructor(name, status, description) {
        super(description);
        this.name = name;
        this.message = description;
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, new.target);
        }
    }
}
// 500 Internal Error
class APIError extends BaseError {
    constructor(description = "api error") {
        super("api internal server error", status_code_1.STATUS_CODES.INTERNAL_ERROR, description);
    }
}
exports.APIError = APIError;
// 401 Validation Error
class ValidationError extends BaseError {
    constructor(description = "bad request") {
        super("bad request", status_code_1.STATUS_CODES.BAD_REQUEST, description);
    }
}
exports.ValidationError = ValidationError;
// 403 Forbidden Error
class ForbiddenError extends BaseError {
    constructor(description = "access denied") {
        super("access denied", status_code_1.STATUS_CODES.FORBIDDEN, description);
    }
}
exports.ForbiddenError = ForbiddenError;
// 401 Authorize error
class AuthorizeError extends BaseError {
    constructor(description = "access denied") {
        super(description, status_code_1.STATUS_CODES.UN_AUTHORISED, description);
    }
}
exports.AuthorizeError = AuthorizeError;
// 404 Not Found
class NotFoundError extends BaseError {
    constructor(description = "not found") {
        super(description, status_code_1.STATUS_CODES.NOT_FOUND, description);
    }
}
exports.NotFoundError = NotFoundError;
// Generic Custom Error
class CustomError extends BaseError {
    constructor(name, status, description) {
        super(name, status, description);
    }
}
exports.CustomError = CustomError;
