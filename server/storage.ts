import { User, InsertUser, Location } from "../shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    
    // Seed mock data
    this.seed();
  }

  private seed() {
    const mockLocations: Location[] = [
      { id: '1', name: 'Manhattan Office', address: '123 5th Avenue, New York, NY', imageUrl: '/attached_assets/manhattan.jpg' },
      { id: '2', name: 'Brooklyn Hub', address: '456 Atlantic Ave, Brooklyn, NY', imageUrl: '/attached_assets/brooklyn.jpg' },
      { id: '3', name: 'Los Angeles Office', address: '789 Wilshire Blvd, LA, CA', imageUrl: '/attached_assets/la.jpg' },
    ];
    mockLocations.forEach(loc => this.locations.set(loc.id, loc));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = Math.random().toString(36).substr(2, 9);
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }
}

export const storage = new MemStorage();
