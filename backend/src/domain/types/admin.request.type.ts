import { adminProperties } from "../entities";

export interface adminLoginRequestType {
  email: string;
  password: string;
}

export interface validAdminResponseType {
  admin: Partial<adminProperties>;
  access_token: string;
  refresh_token: string;
}
