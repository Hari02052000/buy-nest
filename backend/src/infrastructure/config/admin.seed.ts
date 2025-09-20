import { authUtills } from "@/infrastructure/utils";
import { APIError } from "@/domain/entities";
import AdminModel from "@/infrastructure/model/admin.model";

export const createAdmin = async () => {
  try {
    const admins = await AdminModel.find();
    if (admins.length === 0) {
      const password = "12345678";
      const email = "admin@gmail.com";
      const salt = await authUtills.getSalt();
      const userName = "admin";
      const profile =
        "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png";
      const hashedPassword = await authUtills.getHashedPassword(password, salt);
      const newAdmin = new AdminModel({
        userName,
        email,
        password: hashedPassword,
        salt,
        profile,
      });
      await newAdmin.save();
    }
  } catch (error) {
    throw new APIError();
  }
};
