declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userName: string;
        email: string;
        isEmailVerified: boolean;
        profile: string;
        createdAt: string;
        updatedAt: string;
      };
    }
  }
}

export {};
