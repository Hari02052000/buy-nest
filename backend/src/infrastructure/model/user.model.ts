import { Schema, Document, model } from "mongoose";
import { userProperties } from "@/domain/entities";

export type IUser = userProperties & Document;

const userSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      minlength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profile: String,
    salt: String,
    refresh_token: String,
    isGoogleProvided: {
      type: Boolean,
      default: false,
    },
    googleId: String,
    otp: Number,
    otpExp: String,
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
