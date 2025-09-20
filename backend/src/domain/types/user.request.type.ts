import { User } from "../entities";

export interface userRegisterRequestType {
  email: string;
  password: string;
  conformPassword: string;
}

export interface userLoginRequestType {
  email: string;
  password: string;
}

export interface validUserResponseType {
  user: Partial<User>;
  access_token: string;
  refresh_token: string;
}
