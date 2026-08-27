import { Schema, model } from "mongoose";
import { AddressDocument } from "./address.entity";

const addressSchema = new Schema<AddressDocument>(
  {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: "IND" },
    phone: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const AddressModel = model<AddressDocument>("Address", addressSchema);
export default AddressModel;
