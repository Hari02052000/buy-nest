import { Schema, model } from "mongoose";
import { SessionDocument } from "./session.entity";

const sessionSchema = new Schema<SessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userType: { type: String, required: true, enum: ["user", "admin"], index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    lastUsedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const SessionModel = model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
