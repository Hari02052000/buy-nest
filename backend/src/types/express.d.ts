declare global {
  namespace Express {
    interface User {
      id: string;
      userName: string;
      email: string;
      isEmailVerified: boolean;
      profile: string;
      createdAt: string;
      updatedAt: string;
    }
  }
}

export {};
