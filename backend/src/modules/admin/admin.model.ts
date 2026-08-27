import { Schema, model } from "mongoose";
import { AdminDocument } from "./admin.entity";

const adminSchema = new Schema<AdminDocument>(
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
    password: { type: String, minlength: 6, required: true },
    profile: String,
    salt: { type: String, unique: true, required: true },
    refresh_token: { type: String, unique: true },
  },
  { timestamps: true },
);

const AdminModel = model<AdminDocument>("Admin", adminSchema);
export default AdminModel;
