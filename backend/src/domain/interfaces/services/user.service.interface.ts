import { userProperties } from "@/domain/entities";
import { validUserResponseType } from "@/domain/types";

export interface userServiceInterface {
  registerUser(RequestBody: unknown): Promise<validUserResponseType>;
  loginUser(RequestBody: unknown): Promise<validUserResponseType>;
  refreshToken(refreshToken: string): Promise<validUserResponseType>;
  loginViaGoogle(
    email: string,
    googleId: string,
    name: string,
    profile: string,
  ): Promise<Partial<userProperties>>;
  googleSucessess(user: Partial<userProperties>): Promise<validUserResponseType>;
  getCurentUser(userToken: string): Promise<Partial<userProperties>>;
  LogoutUser(userToken: string): Promise<boolean>;
}
