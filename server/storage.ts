import { UserType, InsertUser, Location, Mail, MailSettings, MailAction } from "../shared/schema";

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;

  getPendingMail(): Promise<Mail[]>;
  getMail(id: string): Promise<Mail | undefined>;
  updateMailStatus(id: string, action: MailAction): Promise<Mail | undefined>;

  getMailSettings(userId: string): Promise<MailSettings | undefined>;
  updateMailSettings(userId: string, defaultAction: string): Promise<MailSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, UserType>;
  private locations: Map<string, Location>;
  private mailItems: Map<string, Mail>;
  private mailSettings: Map<string, MailSettings>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.mailItems = new Map();
    this.mailSettings = new Map();
    
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

    const mockMail: Mail[] = [
      {
        id: '1',
        name: 'Mail 01',
        receivedDate: '02/12/2025',
        thumbnailUrl: null,
        envelopeImageUrl: null,
        status: 'pending',
        senderName: 'General John Doe',
        senderAddress: '123 Long Street Apt. 45, Radstock, FL 32178',
        recipientName: 'PFC Harry Dobson',
        recipientAddress: '45th ENG 2nd PLT - B CO, APO AE 34566-2367',
      },
      {
        id: '2',
        name: 'Mail 02',
        receivedDate: '03/12/2025',
        thumbnailUrl: null,
        envelopeImageUrl: null,
        status: 'pending',
        senderName: 'Sarah Williams',
        senderAddress: '456 Oak Avenue, Boston, MA 02115',
        recipientName: 'PFC Harry Dobson',
        recipientAddress: '45th ENG 2nd PLT - B CO, APO AE 34566-2367',
      },
      {
        id: '3',
        name: 'Mail 03',
        receivedDate: '04/12/2025',
        thumbnailUrl: null,
        envelopeImageUrl: null,
        status: 'pending',
        senderName: 'IRS Department',
        senderAddress: '1111 Constitution Ave NW, Washington, DC 20224',
        recipientName: 'PFC Harry Dobson',
        recipientAddress: '45th ENG 2nd PLT - B CO, APO AE 34566-2367',
      },
    ];
    mockMail.forEach(m => this.mailItems.set(m.id, m));

    const defaultSettings: MailSettings = {
      id: '1',
      userId: '1',
      defaultAction: 'keep',
    };
    this.mailSettings.set('1', defaultSettings);
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

  async getPendingMail(): Promise<Mail[]> {
    return Array.from(this.mailItems.values()).filter(m => m.status === 'pending');
  }

  async getMail(id: string): Promise<Mail | undefined> {
    return this.mailItems.get(id);
  }

  async updateMailStatus(id: string, action: MailAction): Promise<Mail | undefined> {
    const mail = this.mailItems.get(id);
    if (mail) {
      const updatedMail = { ...mail, status: action };
      this.mailItems.set(id, updatedMail);
      return updatedMail;
    }
    return undefined;
  }

  async getMailSettings(userId: string): Promise<MailSettings | undefined> {
    return Array.from(this.mailSettings.values()).find(s => s.userId === userId);
  }

  async updateMailSettings(userId: string, defaultAction: string): Promise<MailSettings> {
    let settings = await this.getMailSettings(userId);
    if (settings) {
      settings = { ...settings, defaultAction };
      this.mailSettings.set(settings.id, settings);
      return settings;
    }
    const newSettings: MailSettings = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      defaultAction,
    };
    this.mailSettings.set(newSettings.id, newSettings);
    return newSettings;
  }
}

export const storage = new MemStorage();
