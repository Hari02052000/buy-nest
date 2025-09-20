import { Admin } from "@/domain/entities";

export interface adminRepositoryInterface {
  saveAdmin(admin: Admin): Promise<Admin>;
  editAdmin(admin: Admin): Promise<Admin>;
  getAdminById(adminId: string): Promise<Admin>;
  getAdminByEmail(email: string): Promise<Admin | null>;
  getAllAdmins(skip: number, limit: number): Promise<Admin[]>;
  mapToAdmin(adminDbEntity: unknown): Admin;
}
