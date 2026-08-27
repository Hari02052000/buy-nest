const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

class BaseError extends Error {
  public readonly name: string;
  public readonly status: number;
  public readonly message: string;

  constructor(name: string, status: number, description: string) {
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

export class APIError extends BaseError {
  constructor(description = "api error") {
    super("api internal server error", STATUS_CODES.INTERNAL_ERROR, description);
  }
}

export class ValidationError extends BaseError {
  constructor(description = "bad request") {
    super("bad request", STATUS_CODES.BAD_REQUEST, description);
  }
}

export class ForbiddenError extends BaseError {
  constructor(description = "access denied") {
    super("access denied", STATUS_CODES.FORBIDDEN, description);
  }
}

export class AuthorizeError extends BaseError {
  constructor(description = "unauthorized") {
    super(description, STATUS_CODES.UN_AUTHORISED, description);
  }
}

export class NotFoundError extends BaseError {
  constructor(description = "not found") {
    super(description, STATUS_CODES.NOT_FOUND, description);
  }
}

export class CustomError extends BaseError {
  constructor(name: string, status: number, description: string) {
    super(name, status, description);
  }
}
