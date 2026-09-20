export interface SessionProps {
  sessionId: string;
  userId: string;
  userType: "user" | "admin";
  expiresAt: string;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  sessionId: string;
  userId: string;
  userType: "user" | "admin";
  expiresAt: string;
  lastUsedAt: string;
}

export interface SessionDocument {
  sessionId: string;
  userId: string;
  userType: "user" | "admin";
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
