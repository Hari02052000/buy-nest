"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtils = void 0;
class ResponseUtils {
    static success(data, message = "Success") {
        return {
            success: true,
            message,
            data,
        };
    }
    static error(message = "Error", data = null) {
        return {
            success: false,
            message,
            data,
        };
    }
}
exports.ResponseUtils = ResponseUtils;
