import { UserType, InsertUser, Location, Mail, MailSettings, MailAction, Notification, NotificationPreferences, NotificationType, FunnelSession, FunnelEvent } from "../shared/schema";

export interface BenefitData {
  id: string;
  name: string;
  logo: string;
  category: string;
  discount: string;
  shortDescription: string;
  fullDescription: string;
  dealUrl: string;
  ctaLabel: string;
}

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: Omit<Location, 'id'>): Promise<Location>;

  getPendingMail(): Promise<Mail[]>;
  getMail(id: string): Promise<Mail | undefined>;
  updateMailStatus(id: string, action: MailAction): Promise<Mail | undefined>;

  getMailSettings(userId: string): Promise<MailSettings | undefined>;
  updateMailSettings(userId: string, defaultAction: string): Promise<MailSettings>;

  getNotifications(userId: string, type?: NotificationType): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  markNotificationRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<boolean>;

  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  updateNotificationPreferences(userId: string, prefs: Partial<Omit<NotificationPreferences, 'id' | 'userId'>>): Promise<NotificationPreferences>;

  getBenefits(category?: string): Promise<BenefitData[]>;
  getBenefit(id: string): Promise<BenefitData | undefined>;

  createFunnelSession(session: FunnelSession): Promise<FunnelSession>;
  updateFunnelSession(sessionId: string, updates: Partial<FunnelSession>): Promise<FunnelSession | undefined>;
  getFunnelSession(sessionId: string): Promise<FunnelSession | undefined>;
  createFunnelEvent(event: FunnelEvent): Promise<FunnelEvent>;
  getFunnelEvents(): Promise<FunnelEvent[]>;
  getFunnelSessions(): Promise<FunnelSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, UserType>;
  private locations: Map<string, Location>;
  private mailItems: Map<string, Mail>;
  private mailSettings: Map<string, MailSettings>;
  private notificationItems: Map<string, Notification>;
  private notificationPrefs: Map<string, NotificationPreferences>;
  private benefitItems: Map<string, BenefitData>;
  private funnelSessions: Map<string, FunnelSession>;
  private funnelEvents: Map<string, FunnelEvent>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.mailItems = new Map();
    this.mailSettings = new Map();
    this.notificationItems = new Map();
    this.notificationPrefs = new Map();
    this.benefitItems = new Map();
    this.funnelSessions = new Map();
    this.funnelEvents = new Map();
    
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
      { id: '1285', name: 'Miami Office', address: '848 Brickell Avenue, PH5, Miami, FL 33131', imageUrl: '/attached_assets/miami-office.webp' },
      { id: '776', name: 'Boca Raton Office', address: '1825 NW Corporate Blvd, Suite 110, Boca Raton, FL 33431', imageUrl: '/attached_assets/boca-raton-office.webp' },
      { id: '803', name: 'Fort Lauderdale Office', address: '515 E Las Olas Boulevard, Suite 1301, Fort Lauderdale, FL 33301', imageUrl: '/attached_assets/fort-lauderdale-office.jpg' },
      { id: '1499', name: 'Orlando Office', address: '200 E Robinson Street, Suite 1120, Orlando, FL 32801', imageUrl: '/attached_assets/orlando-office.webp' },
      { id: '885', name: 'Tampa Office', address: '401 East Jackson Street, Suite 2340, Tampa, FL 33602', imageUrl: '/attached_assets/tampa-office.webp' },
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

    const mockNotifications: Notification[] = [
      {
        id: 'n1',
        userId: '1',
        type: 'mail',
        title: 'New Mail Received',
        message: 'You have a new piece of mail from IRS Department waiting at your Miami Office.',
        isRead: false,
        link: '/office',
        createdAt: '2025-02-06T10:30:00Z',
      },
      {
        id: 'n2',
        userId: '1',
        type: 'billing',
        title: 'Invoice Due Soon',
        message: 'Your monthly subscription invoice of $149.00 is due in 3 days.',
        isRead: false,
        link: '/billing',
        createdAt: '2025-02-05T14:00:00Z',
      },
      {
        id: 'n3',
        userId: '1',
        type: 'billing',
        title: 'Payment Processed',
        message: 'Your payment of $149.00 for January has been processed successfully.',
        isRead: true,
        link: '/billing',
        createdAt: '2025-01-30T09:15:00Z',
      },
      {
        id: 'n4',
        userId: '1',
        type: 'account',
        title: 'Password Changed',
        message: 'Your account password was changed successfully. If this wasn\'t you, contact support immediately.',
        isRead: true,
        link: '/account',
        createdAt: '2025-01-28T16:45:00Z',
      },
      {
        id: 'n5',
        userId: '1',
        type: 'service',
        title: 'Phone Number Activated',
        message: 'Your new business phone number (305) 555-9876 has been activated and is ready to use.',
        isRead: false,
        link: '/phone',
        createdAt: '2025-02-04T11:20:00Z',
      },
      {
        id: 'n6',
        userId: '1',
        type: 'mail',
        title: 'Mail Forwarded',
        message: 'Your mail item from Sarah Williams has been forwarded to your registered address.',
        isRead: true,
        link: '/office',
        createdAt: '2025-01-27T08:30:00Z',
      },
      {
        id: 'n7',
        userId: '1',
        type: 'location',
        title: 'New Location Available',
        message: 'A new premium office location is now available in Chicago. Explore our latest offerings.',
        isRead: false,
        link: '/add-location',
        createdAt: '2025-02-03T13:00:00Z',
      },
      {
        id: 'n8',
        userId: '1',
        type: 'service',
        title: 'Call Forwarding Updated',
        message: 'Your call forwarding settings have been updated for your Miami Office number.',
        isRead: true,
        link: '/phone',
        createdAt: '2025-01-25T10:00:00Z',
      },
      {
        id: 'n9',
        userId: '1',
        type: 'account',
        title: 'New Login Detected',
        message: 'A new login to your account was detected from Chrome on Windows. Location: Miami, FL.',
        isRead: false,
        link: '/account',
        createdAt: '2025-02-06T08:00:00Z',
      },
      {
        id: 'n10',
        userId: '1',
        type: 'billing',
        title: 'Add-on Subscription Confirmed',
        message: 'Your Virtual Phone Receptionist add-on has been added to your plan. Monthly cost: $29.99.',
        isRead: false,
        link: '/billing',
        createdAt: '2025-02-01T15:30:00Z',
      },
    ];
    mockNotifications.forEach(n => this.notificationItems.set(n.id, n));

    const defaultNotifPrefs: NotificationPreferences = {
      id: 'np1',
      userId: '1',
      mailEnabled: true,
      billingEnabled: true,
      accountEnabled: true,
      serviceEnabled: true,
      locationEnabled: true,
      emailDelivery: true,
      inAppDelivery: true,
    };
    this.notificationPrefs.set('np1', defaultNotifPrefs);

    const seedBenefits: BenefitData[] = [
      { id: '1', name: 'Spherule', logo: '/logos/spherule.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Step back into classic hoops style with a durable leather upper and vintage design. Perfect for both on-court action and street style, featuring cushioned support and a timeless silhouette. Get premium business management tools to streamline your daily operations and boost team productivity across all departments.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '2', name: 'Segment', logo: '/logos/segment.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Analytics and data platform to help you understand your customers better and make data-driven decisions for your business. Includes advanced segmentation, real-time tracking, and comprehensive reporting dashboards.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '3', name: 'Hourglass', logo: '/logos/hourglass.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Time tracking and project management software designed for small businesses and freelancers to stay organized. Features include automated timesheets, project budgeting, team scheduling, and invoicing integration.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '4', name: 'Lightbox', logo: '/logos/lightbox.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Cloud-based invoicing and accounting solution that simplifies financial management for growing businesses. Automate recurring invoices, track expenses, manage payroll, and generate financial reports effortlessly.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '5', name: 'Capsule', logo: '/logos/capsule.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'CRM platform that helps you build stronger customer relationships and close more deals with powerful automation.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '6', name: 'Layers', logo: '/logos/layers.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Design collaboration tool for teams to create, share, and iterate on projects with real-time feedback.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '7', name: 'Boltshift', logo: '/logos/boltshift.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'E-commerce automation platform to scale your online store with smart inventory and order management.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '8', name: 'Interlock', logo: '/logos/interlock.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Team communication and workflow integration tool that connects all your business apps in one place.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '9', name: 'Alt+Shift', logo: '/logos/altshift.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Keyboard shortcut productivity suite that helps you navigate your workflow faster and more efficiently.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '10', name: 'Polymath', logo: '/logos/polymath.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'AI-powered learning platform for professional development and team training with personalized courses.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '11', name: 'Galileo', logo: '/logos/galileo.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Business intelligence dashboard that visualizes your KPIs and provides actionable insights for growth.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '12', name: 'Epicurious', logo: '/logos/epicurious.svg', category: 'Business Tools', discount: '10% OFF', shortDescription: 'Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather Step back into classic hoops style with a durable leather', fullDescription: 'Corporate catering and meal planning service to keep your team fueled and focused throughout the workday.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '13', name: 'Webflow Pro', logo: '/logos/webflow.svg', category: 'Setup Your Business', discount: '20% OFF', shortDescription: 'Build professional websites without code. Get your business online with beautiful templates and hosting included.', fullDescription: 'Build professional websites without code. Get your business online with beautiful templates and hosting included. Features visual design tools, CMS integration, e-commerce capabilities, and SEO optimization tools.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '14', name: 'BrandKit', logo: '/logos/brandkit.svg', category: 'Setup Your Business', discount: '15% OFF', shortDescription: 'Complete branding toolkit including logo design, business cards, and brand guideline creation for startups.', fullDescription: 'Complete branding toolkit including logo design, business cards, and brand guideline creation for startups. Also includes social media kit, email signature generator, letterhead templates, and brand color palette creator.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '15', name: 'LegalZoom', logo: '/logos/legalzoom.svg', category: 'Setup Your Business', discount: '25% OFF', shortDescription: 'Business formation, trademark registration, and legal document services to protect your company from day one.', fullDescription: 'Business formation, trademark registration, and legal document services to protect your company from day one. Includes LLC formation, registered agent services, operating agreements, and ongoing compliance support.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '16', name: 'QuickBooks', logo: '/logos/quickbooks.svg', category: 'Setup Your Business', discount: '30% OFF', shortDescription: 'Accounting software for small businesses to manage expenses, send invoices, and track profits effortlessly.', fullDescription: 'Accounting software for small businesses to manage expenses, send invoices, and track profits effortlessly. Features include automated bookkeeping, tax preparation, payroll management, and multi-currency support.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '17', name: 'Mailchimp', logo: '/logos/mailchimp.svg', category: 'Marketing Tools', discount: '15% OFF', shortDescription: 'Email marketing platform with automation, audience segmentation, and campaign analytics for growing businesses.', fullDescription: 'Email marketing platform with automation, audience segmentation, and campaign analytics for growing businesses. Includes A/B testing, landing pages, social media integration, and behavioral targeting features.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '18', name: 'HubSpot', logo: '/logos/hubspot.svg', category: 'Marketing Tools', discount: '20% OFF', shortDescription: 'All-in-one marketing, sales, and service platform to attract visitors, convert leads, and delight customers.', fullDescription: 'All-in-one marketing, sales, and service platform to attract visitors, convert leads, and delight customers. Features CRM, email marketing, social media management, content management, and advanced analytics.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '19', name: 'Canva Pro', logo: '/logos/canva.svg', category: 'Marketing Tools', discount: '10% OFF', shortDescription: 'Design stunning marketing materials, social media posts, and presentations with easy-to-use templates.', fullDescription: 'Design stunning marketing materials, social media posts, and presentations with easy-to-use templates. Includes brand kit, magic resize, content planner, team collaboration, and premium stock assets.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '20', name: 'Buffer', logo: '/logos/buffer.svg', category: 'Marketing Tools', discount: '15% OFF', shortDescription: 'Social media management tool to schedule posts, analyze performance, and grow your audience across platforms.', fullDescription: 'Social media management tool to schedule posts, analyze performance, and grow your audience across platforms. Features include auto-scheduling, engagement tracking, hashtag suggestions, and team approval workflows.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '21', name: 'ShipStation', logo: '/logos/shipstation.svg', category: 'Shipping Deals', discount: '25% OFF', shortDescription: 'Shipping automation platform that integrates with all major carriers to save time and reduce shipping costs.', fullDescription: 'Shipping automation platform that integrates with all major carriers to save time and reduce shipping costs. Features batch label printing, automated tracking, custom packing slips, and multi-channel order management.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '22', name: 'FedEx Business', logo: '/logos/fedex.svg', category: 'Shipping Deals', discount: '30% OFF', shortDescription: 'Exclusive business shipping rates for domestic and international deliveries with priority handling.', fullDescription: 'Exclusive business shipping rates for domestic and international deliveries with priority handling. Includes volume discounts, dedicated account manager, customs brokerage support, and real-time package tracking.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '23', name: 'UPS My Choice', logo: '/logos/ups.svg', category: 'Shipping Deals', discount: '20% OFF', shortDescription: 'Discounted business shipping with package tracking, delivery alerts, and flexible delivery options.', fullDescription: 'Discounted business shipping with package tracking, delivery alerts, and flexible delivery options. Features include scheduled pickups, returns management, address validation, and shipment insurance.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '24', name: 'Pirate Ship', logo: '/logos/pirateship.svg', category: 'Shipping Deals', discount: '15% OFF', shortDescription: 'Free shipping software with the cheapest USPS and UPS rates for e-commerce businesses of all sizes.', fullDescription: 'Free shipping software with the cheapest USPS and UPS rates for e-commerce businesses of all sizes. No monthly fees, no markups, just the lowest rates available with easy batch printing and tracking.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '25', name: 'Hotels.com Biz', logo: '/logos/hotels.svg', category: 'Travel', discount: '20% OFF', shortDescription: 'Corporate hotel booking with exclusive business rates, loyalty rewards, and flexible cancellation policies.', fullDescription: 'Corporate hotel booking with exclusive business rates, loyalty rewards, and flexible cancellation policies. Features include expense reporting integration, duty of care tools, and a vast network of 500,000+ properties.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '26', name: 'United Airlines', logo: '/logos/united.svg', category: 'Travel', discount: '15% OFF', shortDescription: 'Discounted business travel flights with priority boarding, extra baggage, and flexible rebooking options.', fullDescription: 'Discounted business travel flights with priority boarding, extra baggage, and flexible rebooking options. MileagePlus perks, United Club access, and dedicated corporate travel support included.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '27', name: 'Hertz Business', logo: '/logos/hertz.svg', category: 'Travel', discount: '25% OFF', shortDescription: 'Premium car rental rates for business travelers with free upgrades and loyalty points on every booking.', fullDescription: 'Premium car rental rates for business travelers with free upgrades and loyalty points on every booking. Includes Gold Plus Rewards membership, expedited pickup, and a wide selection of premium vehicles.', dealUrl: '#', ctaLabel: 'Get Deal' },
      { id: '28', name: 'TripActions', logo: '/logos/tripactions.svg', category: 'Travel', discount: '10% OFF', shortDescription: 'All-in-one corporate travel management platform with real-time policy compliance and expense tracking.', fullDescription: 'All-in-one corporate travel management platform with real-time policy compliance and expense tracking. Features include 24/7 travel support, dynamic policy engine, carbon footprint tracking, and integrated payments.', dealUrl: '#', ctaLabel: 'Get Deal' },
    ];
    seedBenefits.forEach(b => this.benefitItems.set(b.id, b));

    this.seedFunnelData();
  }

  private seedFunnelData() {
    const steps: Array<'your_info' | 'customize' | 'checkout'> = [
      'your_info', 'customize', 'checkout'
    ];

    const baseDate = new Date('2026-02-09T00:00:00Z');
    let eventCounter = 0;

    const sessionProfiles = [
      { maxStep: 2, durations: [45, 95, 70] },
      { maxStep: 2, durations: [30, 80, 55] },
      { maxStep: 2, durations: [60, 110, 85] },
      { maxStep: 2, durations: [35, 75, 60] },
      { maxStep: 1, durations: [50, 90] },
      { maxStep: 1, durations: [25, 70] },
      { maxStep: 1, durations: [70, 85] },
      { maxStep: 1, durations: [38, 100] },
      { maxStep: 1, durations: [55, 65] },
      { maxStep: 1, durations: [40, 78] },
      { maxStep: 1, durations: [65, 92] },
      { maxStep: 0, durations: [90] },
      { maxStep: 0, durations: [15] },
      { maxStep: 0, durations: [120] },
      { maxStep: 0, durations: [25] },
      { maxStep: 0, durations: [45] },
      { maxStep: 0, durations: [60] },
      { maxStep: 0, durations: [35] },
      { maxStep: 0, durations: [80] },
      { maxStep: 0, durations: [50] },
      { maxStep: 0, durations: [40] },
      { maxStep: 0, durations: [55] },
    ];

    for (let day = 13; day >= 0; day--) {
      const dayDate = new Date(baseDate);
      dayDate.setDate(dayDate.getDate() - day);
      const dateStr = dayDate.toISOString().split('T')[0];

      const dailyMultiplier = day < 3 ? 1.4 : day < 7 ? 1.0 : 0.7;
      const sessionsToday = Math.round(sessionProfiles.length * dailyMultiplier);

      for (let s = 0; s < sessionsToday; s++) {
        const profile = sessionProfiles[s % sessionProfiles.length];
        const sessionId = `seed_${dateStr}_${s}`;
        const hourOffset = Math.floor((s / sessionsToday) * 14) + 8;
        const minuteOffset = Math.floor(Math.random() * 60);

        const sessionStart = new Date(dayDate);
        sessionStart.setHours(hourOffset, minuteOffset, 0, 0);

        const completedCheckout = profile.maxStep === 2;

        this.funnelSessions.set(sessionId, {
          id: `sid_${eventCounter++}`,
          sessionId,
          startedAt: sessionStart.toISOString(),
          lastSeenAt: sessionStart.toISOString(),
          userAgent: ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'Mozilla/5.0 (Linux; Android 14)'][s % 4],
          referrer: ['https://google.com', 'https://facebook.com', '', 'https://linkedin.com', 'direct'][s % 5],
          completed: completedCheckout,
        });

        let currentTime = new Date(sessionStart);

        for (let stepIdx = 0; stepIdx <= profile.maxStep; stepIdx++) {
          const step = steps[stepIdx];

          this.funnelEvents.set(`fe_${eventCounter}`, {
            id: `fe_${eventCounter++}`,
            sessionId,
            step,
            eventType: 'enter',
            timestamp: currentTime.toISOString(),
            duration: null,
            metadata: null,
          });

          if (stepIdx < profile.maxStep || (stepIdx === profile.maxStep && completedCheckout)) {
            const duration = profile.durations[stepIdx] + Math.floor(Math.random() * 20) - 10;
            currentTime = new Date(currentTime.getTime() + duration * 1000);

            this.funnelEvents.set(`fe_${eventCounter}`, {
              id: `fe_${eventCounter++}`,
              sessionId,
              step,
              eventType: 'complete',
              timestamp: currentTime.toISOString(),
              duration: Math.max(5, duration),
              metadata: null,
            });
          }
        }

        const lastTime = currentTime;
        const sessionEntry = this.funnelSessions.get(sessionId)!;
        sessionEntry.lastSeenAt = lastTime.toISOString();
        this.funnelSessions.set(sessionId, sessionEntry);
      }
    }
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

  async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
    const id = Math.random().toString(36).substr(2, 9);
    const newLocation: Location = { id, ...location };
    this.locations.set(id, newLocation);
    return newLocation;
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

  async getNotifications(userId: string, type?: NotificationType): Promise<Notification[]> {
    const all = Array.from(this.notificationItems.values())
      .filter(n => n.userId === userId);
    const filtered = type ? all.filter(n => n.type === type) : all;
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    return Array.from(this.notificationItems.values())
      .filter(n => n.userId === userId && !n.isRead).length;
  }

  async markNotificationRead(id: string): Promise<Notification | undefined> {
    const notif = this.notificationItems.get(id);
    if (notif) {
      const updated = { ...notif, isRead: true };
      this.notificationItems.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    for (const [id, notif] of this.notificationItems.entries()) {
      if (notif.userId === userId && !notif.isRead) {
        this.notificationItems.set(id, { ...notif, isRead: true });
      }
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notificationItems.delete(id);
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    return Array.from(this.notificationPrefs.values()).find(p => p.userId === userId);
  }

  async updateNotificationPreferences(userId: string, prefs: Partial<Omit<NotificationPreferences, 'id' | 'userId'>>): Promise<NotificationPreferences> {
    let existing = await this.getNotificationPreferences(userId);
    if (existing) {
      const updated = { ...existing, ...prefs };
      this.notificationPrefs.set(existing.id, updated);
      return updated;
    }
    const newPrefs: NotificationPreferences = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      mailEnabled: prefs.mailEnabled ?? true,
      billingEnabled: prefs.billingEnabled ?? true,
      accountEnabled: prefs.accountEnabled ?? true,
      serviceEnabled: prefs.serviceEnabled ?? true,
      locationEnabled: prefs.locationEnabled ?? true,
      emailDelivery: prefs.emailDelivery ?? true,
      inAppDelivery: prefs.inAppDelivery ?? true,
    };
    this.notificationPrefs.set(newPrefs.id, newPrefs);
    return newPrefs;
  }

  async getBenefits(category?: string): Promise<BenefitData[]> {
    const all = Array.from(this.benefitItems.values());
    if (!category || category === 'All') return all;
    return all.filter(b => b.category === category);
  }

  async getBenefit(id: string): Promise<BenefitData | undefined> {
    return this.benefitItems.get(id);
  }

  async createFunnelSession(session: FunnelSession): Promise<FunnelSession> {
    this.funnelSessions.set(session.sessionId, session);
    return session;
  }

  async updateFunnelSession(sessionId: string, updates: Partial<FunnelSession>): Promise<FunnelSession | undefined> {
    const existing = this.funnelSessions.get(sessionId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.funnelSessions.set(sessionId, updated);
    return updated;
  }

  async getFunnelSession(sessionId: string): Promise<FunnelSession | undefined> {
    return this.funnelSessions.get(sessionId);
  }

  async createFunnelEvent(event: FunnelEvent): Promise<FunnelEvent> {
    this.funnelEvents.set(event.id, event);
    return event;
  }

  async getFunnelEvents(): Promise<FunnelEvent[]> {
    return Array.from(this.funnelEvents.values());
  }

  async getFunnelSessions(): Promise<FunnelSession[]> {
    return Array.from(this.funnelSessions.values());
  }
}

export const storage = new MemStorage();
