import { adminProperties, AuthorizeError, userProperties } from "@/domain/entities";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "@/infrastructure/config/environment";

const APP_SCERET = env.APP_SCERET || "my secret";

const isValidUserToken = (token: string): { payload: Partial<userProperties>; isVerified: boolean } => {
  try {
    if (!token) throw new AuthorizeError("token not found");
    const payload = jwt.verify(token, APP_SCERET) as Partial<userProperties>;
    return { isVerified: true, payload };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthorizeError("token expired");
    }
    if (error instanceof JsonWebTokenError) {
      throw new AuthorizeError("invalid token");
    }
    throw new AuthorizeError();
  }
};
const isValidAdminToken = (token: string): { payload: Partial<adminProperties>; isVerified: boolean } => {
  try {
    if (!token) throw new AuthorizeError("token not found");
    const payload = jwt.verify(token, APP_SCERET) as Partial<adminProperties>;
    return { isVerified: true, payload };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthorizeError("admin token expired");
    }
    if (error instanceof JsonWebTokenError) {
      throw new AuthorizeError("invalid token");
    }
    throw new AuthorizeError();
  }
};

export const tokenUtils: tokenValidationUtillsInterface = {
  isValidAdminToken,
  isValidUserToken,
};
