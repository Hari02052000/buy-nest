import { injectable } from "tsyringe";
import AdminModel from "./admin.model";
import { Admin } from "./admin.entity";
import { APIError } from "@/shared/errors";

@injectable()
export class AdminRepository {
  async save(admin: Admin): Promise<Admin> {
    try {
      const doc = new AdminModel({
        userName: admin.userName,
        email: admin.email,
        password: admin.password,
        salt: admin.salt,
        profile: admin.profile,
      });
      const saved = await doc.save();
      return Admin.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to save admin");
    }
  }

  async findById(id: string): Promise<Admin | null> {
    try {
      const doc = await AdminModel.findById(id);
      if (!doc) return null;
      return Admin.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find admin");
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const doc = await AdminModel.findOne({ email });
      if (!doc) return null;
      return Admin.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find admin by email");
    }
  }

  async update(id: string, data: Partial<Admin>): Promise<Admin | null> {
    try {
      const doc = await AdminModel.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (!doc) return null;
      return Admin.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to update admin");
    }
  }

  async findAll(skip: number, limit: number): Promise<Admin[]> {
    try {
      const docs = await AdminModel.find().skip(skip).limit(limit);
      return docs.map((doc) => Admin.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch admins");
    }
  }
}
