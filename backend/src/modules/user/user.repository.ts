import { injectable } from "tsyringe";
import UserModel from "./user.model";
import { User, UserDocument } from "./user.entity";
import { NotFoundError, APIError } from "@/shared/errors";

@injectable()
export class UserRepository {
  async save(user: User): Promise<User> {
    try {
      const doc = new UserModel({
        userName: user.userName,
        email: user.email,
        password: user.password,
        salt: user.salt,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile,
        refresh_token: user.refresh_token,
        isGoogleProvided: user.isGoogleProvided,
        googleId: user.googleId,
        otp: user.otp,
        otpExp: user.otpExp,
      });
      const saved = await doc.save();
      return User.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to save user");
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const doc = await UserModel.findById(id);
      if (!doc) return null;
      return User.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find user");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const doc = await UserModel.findOne({ email });
      if (!doc) return null;
      return User.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find user by email");
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const doc = await UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (!doc) return null;
      return User.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to update user");
    }
  }

  async findAll(skip: number, limit: number): Promise<User[]> {
    try {
      const docs = await UserModel.find().skip(skip).limit(limit);
      return docs.map((doc) => User.fromDocument(doc));
    } catch (error) {
      throw new APIError("Failed to fetch users");
    }
  }
}
