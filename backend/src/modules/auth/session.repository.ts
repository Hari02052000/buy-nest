import { injectable } from "tsyringe";
import SessionModel from "./session.model";
import { CreateSessionInput, SessionDocument } from "./session.entity";
import { APIError } from "@/shared/errors";

@injectable()
export class SessionRepository {
  async create(input: CreateSessionInput): Promise<SessionDocument> {
    try {
      const doc = new SessionModel({
        sessionId: input.sessionId,
        userId: input.userId,
        userType: input.userType,
        expiresAt: input.expiresAt,
        lastUsedAt: input.lastUsedAt,
      });
      return await doc.save();
    } catch (error) {
      throw new APIError("Failed to create session");
    }
  }

  async findBySessionId(sessionId: string): Promise<SessionDocument | null> {
    try {
      return await SessionModel.findOne({ sessionId });
    } catch (error) {
      throw new APIError("Failed to find session");
    }
  }

  async findById(id: string): Promise<SessionDocument | null> {
    try {
      return await SessionModel.findById(id);
    } catch (error) {
      throw new APIError("Failed to find session");
    }
  }

  async delete(sessionId: string): Promise<void> {
    try {
      await SessionModel.deleteOne({ sessionId });
    } catch (error) {
      throw new APIError("Failed to delete session");
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await SessionModel.deleteMany({ userId });
    } catch (error) {
      throw new APIError("Failed to delete sessions");
    }
  }

  async updateLastUsed(sessionId: string): Promise<void> {
    try {
      await SessionModel.findOneAndUpdate(
        { sessionId },
        { lastUsedAt: new Date() },
      );
    } catch (error) {
      throw new APIError("Failed to update session");
    }
  }
}
