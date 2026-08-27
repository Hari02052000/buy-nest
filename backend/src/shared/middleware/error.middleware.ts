import { Request, Response, NextFunction } from "express";
import { APIError, AuthorizeError, ForbiddenError, NotFoundError, ValidationError } from "../errors";
import logger from "../config/logger";

export const handleError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let status = 500;
  let message = "Internal server error";
  let isKnown = false;

  if (error instanceof APIError) {
    status = error.status;
    message = error.message;
    isKnown = true;
  } else if (error instanceof ValidationError) {
    status = error.status;
    message = error.message;
    isKnown = true;
  } else if (error instanceof AuthorizeError) {
    status = error.status;
    message = error.message;
    isKnown = true;
  } else if (error instanceof ForbiddenError) {
    status = error.status;
    message = error.message;
    isKnown = true;
  } else if (error instanceof NotFoundError) {
    status = error.status;
    message = error.message;
    isKnown = true;
  }

  if (isKnown) {
    logger.warn({ err: error }, message);
  } else {
    logger.error({ err: error }, "Unhandled error");
  }

  res.status(status).json({ error: message });
};
