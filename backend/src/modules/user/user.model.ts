import { Schema, model } from "mongoose";
import { UserDocument } from "./user.entity";

const userSchema = new Schema<UserDocument>(
  {
    userName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: { validator: (v: string) => /^\S+@\S+\.\S+$/.test(v), message: "Invalid email" },
    },
    password: { type: String, minlength: 6 },
    isEmailVerified: { type: Boolean, default: false },
    profile: String,
    salt: String,
    refresh_token: String,
    isGoogleProvided: { type: Boolean, default: false },
    googleId: String,
    otp: Number,
    otpExp: String,
  },
  { timestamps: true },
);

const UserModel = model<UserDocument>("User", userSchema);
export default UserModel;
