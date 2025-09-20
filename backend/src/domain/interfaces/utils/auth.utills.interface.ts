import { adminProperties, userProperties } from "@/domain/entities";
import { adminLoginRequestType, userLoginRequestType, userRegisterRequestType } from "@/domain/types";

export interface authUtillsInterface {
  getSalt(): Promise<string>;
  getHashedPassword(password: string, salt: string): Promise<string>;
  validatePassword(enterdPassword: string, savedPassword: string, salt: string): Promise<boolean>;
  generateAcessToken(email: string, id: string): string;
  generateRefreshToken(id: string): string;
  validateUserLoginInput(reqBody: any): userLoginRequestType;
  validateUserRegisterInput(reqBody: any): userRegisterRequestType;
  validateAdminLoginInput(reqBody: any): adminLoginRequestType;
}
