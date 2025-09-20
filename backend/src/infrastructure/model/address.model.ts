import mongoose, { Schema, Document, model } from "mongoose";
import { addressProperties } from "@/domain/entities";
import { IUser } from "./user.model";

type addressWithoutUser = Omit<addressProperties, "user">;
type addressDb = addressWithoutUser & {
  user: Schema.Types.ObjectId | IUser;
};
export type IAddress = addressDb & Document;

const AddressSchema: Schema<IAddress> = new Schema(
  {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: "IND" },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const AddressModel = model<IAddress>("Address", AddressSchema);

export default AddressModel;
