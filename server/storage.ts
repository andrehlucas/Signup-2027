import { UserType, InsertUser, Location } from "../shared/schema";

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, UserType>;
  private locations: Map<string, Location>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    
    // Seed mock data
    this.seed();
  }

  private seed() {
    const mockUser: UserType = {
      id: '1',
      username: 'demo_user',
      password: 'password123',
      businessName: 'Acme Corporation',
    };
    this.users.set(mockUser.id, mockUser);

    const mockLocations: Location[] = [
      { id: '1', name: 'Manhattan Office', address: '123 5th Avenue, New York, NY', imageUrl: '/attached_assets/manhattan.jpg' },
      { id: '2', name: 'Brooklyn Hub', address: '456 Atlantic Ave, Brooklyn, NY', imageUrl: '/attached_assets/brooklyn.jpg' },
      { id: '3', name: 'Los Angeles Office', address: '789 Wilshire Blvd, LA, CA', imageUrl: '/attached_assets/la.jpg' },
    ];
    mockLocations.forEach(loc => this.locations.set(loc.id, loc));
  }

  async getUser(id: string): Promise<UserType | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const id = Math.random().toString(36).substr(2, 9);
    const user: UserType = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      businessName: insertUser.businessName ?? "Opus Business"
    };
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
