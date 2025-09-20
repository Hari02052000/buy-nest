import { User } from "@/domain/entities";

export interface userRepositoryInterface {
  saveUser(user: User): Promise<User>;
  editUser(user: User): Promise<User>;
  getUserById(userId: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(skip: number, limit: number): Promise<User[]>;
  mapToUser(userDbEntity: unknown): User;
}
