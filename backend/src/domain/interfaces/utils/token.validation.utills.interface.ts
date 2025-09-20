import { adminProperties } from "@/domain/entities";

export interface tokenValidationUtillsInterface {
  isValidAdminToken(adminToken: string): { isVerified: boolean; payload: Partial<adminProperties> };
  isValidUserToken(userToken: string): { isVerified: boolean; payload: Partial<adminProperties> };
}
