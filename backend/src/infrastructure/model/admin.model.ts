import { Schema, Document, model } from "mongoose";
import { adminProperties } from "@/domain/entities";

export type IAdmin = adminProperties & Document;

const adminSchema: Schema<IAdmin> = new Schema(
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
      required: true,
    },
    profile: String,
    salt: {
      type: String,
      unique: true,
      required: true,
    },
    refresh_token: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const AdminModel = model<IAdmin>("Admin", adminSchema);

export default AdminModel;
