import { adminProperties } from "@/domain/entities";
import { validAdminResponseType } from "@/domain/types";

export interface adminServiceInterface {
  loginAdmin(RequestBody: unknown): Promise<validAdminResponseType>;
  adminRefreshToken(refresh_token: string): Promise<validAdminResponseType>;
  getcurentAdmin(admin_token: string): Promise<Partial<adminProperties>>;
  logOutAdmin(admin_token: string): Promise<Partial<adminProperties>>;
}
