import { APIError, ValidationError, User, userProperties } from "@/domain/entities";
import { userRepositoryInterface } from "@/domain/interfaces/repository";
import UserModel, { IUser } from "../model/user.model";

export class userRepository implements userRepositoryInterface {
  async saveUser(user: User): Promise<User> {
    try {
      let userDb;
      if (user.isGoogleProvided && user.googleId) {
        userDb = new UserModel({
          userName: user.userName,
          email: user.email,
          isGoogleProvided: true,
          googleId: user.googleId,
          profile: user.profile,
        });
      } else {
        userDb = new UserModel({
          userName: user.userName,
          email: user.email,
          password: user.password,
          salt: user.salt,
        });
      }
      await userDb.save();
      return this.mapToUser(userDb);
    } catch (error) {
      console.log(error);
      throw new APIError();
    }
  }
  async editUser(user: User): Promise<User> {
    try {
      const modifiedFields = user.modifiedFields;
      if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
      const updatedFields: Record<keyof Omit<userProperties, "id">, any> = {} as Record<
        keyof Omit<userProperties, "id">,
        any
      >;
      for (const key in modifiedFields) {
        if (modifiedFields.hasOwnProperty(key)) {
          const fieldKey = key as keyof Omit<userProperties, "id">;
          if (modifiedFields[fieldKey]) {
            updatedFields[fieldKey] = user[fieldKey];
          }
        }
      }
      if (updatedFields.updatedAt) delete updatedFields.updatedAt;
      await UserModel.findByIdAndUpdate(user.id, updatedFields);
      user.clearModifiedFields;
      const updatedUser = await this.getUserById(user.id);
      return updatedUser;
    } catch (error) {
      throw new APIError();
    }
  }
  async getUserById(userId: string): Promise<User> {
    try {
      const userDb = await UserModel.findById(userId);
      if (!userDb) throw new ValidationError();
      return this.mapToUser(userDb);
    } catch (error) {
      throw new APIError();
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userDb = await UserModel.findOne({ email });
      if (!userDb) return null;
      return this.mapToUser(userDb);
    } catch (error) {
      throw new APIError();
    }
  }
  async getAllUsers(skip: number, limit: number): Promise<User[]> {
    try {
      const users = await UserModel.find().skip(skip).limit(limit);
      return users.map((user) => this.mapToUser(user));
    } catch (error) {
      throw new APIError();
    }
  }
  mapToUser(userDbEntity: IUser): User {
    const user = new User(
      userDbEntity.id,
      userDbEntity.userName,
      userDbEntity.email,
      userDbEntity.isGoogleProvided,
      userDbEntity.profile,
      userDbEntity.password,
      userDbEntity.salt,
    );
    user.isEmailVerified = userDbEntity.isEmailVerified;
    user.refresh_token = userDbEntity.refresh_token;
    user.otp = userDbEntity.otp;
    user.googleId = userDbEntity.googleId;
    user.otpExp = userDbEntity.otpExp;
    user.createdAt = userDbEntity.createdAt;
    user.updatedAt = userDbEntity.updatedAt;
    return user;
  }
}
