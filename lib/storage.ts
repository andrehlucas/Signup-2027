import { type UserType, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
}

export class MemStorage implements IStorage {
  private users: Map<string, UserType>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<UserType | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const id = randomUUID();
    const user: UserType = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      businessName: insertUser.businessName ?? "Opus Business",
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
