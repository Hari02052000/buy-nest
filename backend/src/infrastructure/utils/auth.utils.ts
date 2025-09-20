import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUtillsInterface } from "@/domain/interfaces/utils";
import { adminLoginRequestType, userLoginRequestType, userRegisterRequestType } from "@/domain/types";
import { ValidationError } from "@/domain/entities/errors";
import { LoginValidator, RegisterValidator } from "./validator";
import { env } from "@/infrastructure/config/environment";
const APP_SCERET = env.APP_SCERET || "my secret";

const getSalt = async () => {
  return await bcrypt.genSalt();
};
const getHashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (enterdPassword: string, savedPassword: string, salt: string) => {
  return (await getHashedPassword(enterdPassword, salt)) === savedPassword;
};

const generateAcessToken = (email: string, id: string) => {
  return jwt.sign(
    {
      id,
      email,
    },
    APP_SCERET,
    {
      expiresIn: "15m",
    },
  );
};
const generateRefreshToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    APP_SCERET,
    {
      expiresIn: "1d",
    },
  );
};
const validateUserLoginInput = (reqBody: any): userLoginRequestType => {
  const { error } = LoginValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else return { email: reqBody.email, password: reqBody.password };
};
const validateUserRegisterInput = (reqBody: any): userRegisterRequestType => {
  const { error } = RegisterValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else return { conformPassword: reqBody.conformPassword, email: reqBody.email, password: reqBody.password };
};

const validateAdminLoginInput = (reqBody: any): adminLoginRequestType => {
  const { error } = LoginValidator.validate(reqBody);
  if (error) throw new ValidationError(error.details[0].message);
  else return { email: reqBody.email, password: reqBody.password };
};

export const authUtills: authUtillsInterface = {
  getSalt,
  getHashedPassword,
  validatePassword,
  generateAcessToken,
  generateRefreshToken,
  validateUserLoginInput,
  validateUserRegisterInput,
  validateAdminLoginInput,
};
