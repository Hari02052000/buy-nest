"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const entities_1 = require("../../domain/entities");
const handleError = (error, req, res, next) => {
    let reportedError = true;
    let status = 500;
    let data = error.message;
    [entities_1.APIError, entities_1.AuthorizeError, entities_1.NotFoundError, entities_1.ValidationError, entities_1.ForbiddenError].forEach((typeOfError) => {
        if (error instanceof typeOfError) {
            reportedError = false;
            data = error.message;
            status = error.status;
        }
    });
    if (reportedError) {
        console.error(error);
    }
    else {
        console.warn(error);
    }
    res.status(status).json({ error: data });
    return;
};
exports.handleError = handleError;
