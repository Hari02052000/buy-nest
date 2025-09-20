import { Admin, adminProperties, APIError, ValidationError } from "@/domain/entities";
import { adminRepositoryInterface } from "@/domain/interfaces/repository";
import AdminModel, { IAdmin } from "../model/admin.model";

export class adminRepository implements adminRepositoryInterface {
  async saveAdmin(admin: Admin): Promise<Admin> {
    try {
      const admindb = new AdminModel({
        userName: admin.userName,
        email: admin.email,
        password: admin.password,
        salt: admin.salt,
      });
      await admindb.save();
      return this.mapToAdmin(admindb);
    } catch (error) {
      throw new APIError();
    }
  }
  async editAdmin(admin: Admin): Promise<Admin> {
    try {
      const modifiedFields = admin.modifiedFields;
      if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
      const updatedFields: Record<keyof Omit<adminProperties, "id">, any> = {} as Record<
        keyof Omit<adminProperties, "id">,
        any
      >;
      for (const key in modifiedFields) {
        if (modifiedFields.hasOwnProperty(key)) {
          const fieldKey = key as keyof Omit<adminProperties, "id">;
          if (modifiedFields[fieldKey]) {
            updatedFields[fieldKey] = admin[fieldKey];
          }
        }
      }
      if (updatedFields.updatedAt) delete updatedFields.updatedAt;
      await AdminModel.findByIdAndUpdate(admin.id, updatedFields);
      admin.clearModifiedFields;
      const updatedAdmin = await this.getAdminById(admin.id);
      return updatedAdmin;
    } catch (error) {
      throw new APIError();
    }
  }
  async getAdminById(adminId: string): Promise<Admin> {
    try {
      const admin = await AdminModel.findById(adminId);
      if (!admin) throw new ValidationError();
      return this.mapToAdmin(admin);
    } catch (error) {
      throw new APIError();
    }
  }
  async getAdminByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await AdminModel.findOne({ email });
      if (!admin) return null;
      return this.mapToAdmin(admin);
    } catch (error) {
      throw new APIError();
    }
  }
  getAllAdmins(skip: number, limit: number): Promise<Admin[]> {
    throw new Error("Method not implemented.");
  }
  mapToAdmin(adminDbEntity: IAdmin): Admin {
    const admin = new Admin(
      adminDbEntity.id,
      adminDbEntity.userName,
      adminDbEntity.email,
      adminDbEntity.password,
      adminDbEntity.salt,
    );
    admin.profile = adminDbEntity.profile;
    admin.refresh_token = adminDbEntity.refresh_token;
    admin.createdAt = adminDbEntity.createdAt;
    admin.updatedAt = adminDbEntity.updatedAt;
    return admin;
  }
}
