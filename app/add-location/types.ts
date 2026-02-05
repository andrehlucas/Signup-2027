export interface AvailableLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  zipCode: string;
  imageUrl: string;
  isPremium: boolean;
  mapUrl?: string;
}

export interface Bundle {
  id: string;
  name: string;
  tier: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeColor?: string;
  features: {
    businessAddress: boolean;
    liveCallAnswering: boolean;
    callTransferring: boolean;
    calloutFeature: boolean;
    tollFreeNumber: boolean;
    callLog: boolean;
    supervisedCallTransfer: boolean;
    messageTaking: boolean;
  };
}

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'local' | 'toll-free';
  areaCode: string;
  isAvailable: boolean;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  price: number;
  billingCycle: 'monthly' | 'one-time';
  category: string;
}

export interface CartItem {
  id: string;
  type: 'bundle' | 'addon' | 'location';
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'one-time';
}

export interface OrderState {
  location: AvailableLocation | null;
  bundle: Bundle | null;
  phoneNumber: PhoneNumber | null;
  addons: Addon[];
  extensionCount: number;
  agreementAccepted: boolean;
}

export const bundles: Bundle[] = [
  {
    id: 'essentials',
    name: 'The Ultimate Office Solution',
    tier: 'The Essentials',
    price: 99,
    badge: 'The Essentials',
    badgeColor: 'bg-[#36bff9]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: false,
      tollFreeNumber: false,
      callLog: false,
      supervisedCallTransfer: false,
      messageTaking: false,
    },
  },
  {
    id: 'plus',
    name: 'The Ultimate Office',
    tier: 'PLUS',
    price: 119,
    originalPrice: 129,
    badge: 'Popular Upgrades',
    badgeColor: 'bg-[#36bff9]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: true,
      tollFreeNumber: false,
      callLog: false,
      supervisedCallTransfer: false,
      messageTaking: false,
    },
  },
  {
    id: 'pro',
    name: 'The Ultimate Office',
    tier: 'PRO',
    price: 149,
    originalPrice: 179,
    badge: 'The Professional',
    badgeColor: 'bg-[#36bff9]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: false,
    },
  },
  {
    id: 'premium',
    name: 'The Ultimate Office',
    tier: 'PREMIUM',
    price: 179,
    originalPrice: 229,
    badge: 'The Best Value',
    badgeColor: 'bg-[#36bff9]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: true,
    },
  },
];

export const featureLabels: Record<string, string> = {
  businessAddress: 'Business Address',
  liveCallAnswering: 'Live Call Answering',
  callTransferring: 'Call Transferring',
  calloutFeature: 'Callout Feature',
  tollFreeNumber: 'Toll-Free Number',
  callLog: 'Call Log',
  supervisedCallTransfer: 'Supervised Call Transfer',
  messageTaking: 'Message Taking',
};

export const availableAddons: Addon[] = [
  {
    id: 'toll-free',
    name: 'Toll Free Number',
    description: 'Get a professional 1-800 number for your business',
    detailedDescription: 'A toll-free number allows customers to call you without incurring long-distance charges. This professional touch builds trust and makes it easier for customers nationwide to reach you. Includes a vanity number option and call analytics.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'additional-phone',
    name: 'Additional Phone Number',
    description: 'Add an extra local phone number to your account',
    detailedDescription: 'Expand your presence with additional local phone numbers. Perfect for businesses that want to appear local in multiple markets, or for separating different departments or product lines with unique numbers.',
    price: 25,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'call-log',
    name: 'Call Logs',
    description: 'Detailed logs of all incoming and outgoing calls',
    detailedDescription: 'Access comprehensive call history with detailed information including caller ID, call duration, time stamps, and call outcomes. Export reports for analysis and track communication patterns to improve your business operations.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'call-recording',
    name: 'Call Recording',
    description: 'Record incoming and outgoing calls for your records',
    detailedDescription: 'Automatically record all business calls for quality assurance, training, and compliance purposes. Recordings are securely stored and easily accessible through your dashboard. Perfect for customer service improvement and dispute resolution.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'callout',
    name: 'Callout',
    description: 'Outbound calling capability from your business line',
    detailedDescription: 'Make outbound calls that display your business number as the caller ID. This feature allows you to reach customers professionally while keeping your personal number private. Includes call scheduling and contact management.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'conf-bridge',
    name: 'Conference Bridge',
    description: 'Host conference calls with multiple participants',
    detailedDescription: 'Host professional conference calls with up to 25 participants. Features include dial-in numbers, host controls, mute/unmute capabilities, and recording options. Perfect for team meetings and client presentations.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'dba',
    name: 'DBA',
    description: 'Register a "Doing Business As" name for your company',
    detailedDescription: 'Establish your business identity with a registered DBA (Doing Business As) name. We handle the filing process with local authorities, ensuring compliance with state and local regulations. Includes certificate of registration.',
    price: 59,
    billingCycle: 'monthly',
    category: 'business',
  },
  {
    id: 'fax-out',
    name: 'Fax Out',
    description: 'Send faxes from your business number',
    detailedDescription: 'Send faxes directly from your email or dashboard using your business fax number. No physical fax machine needed. Track delivery confirmations and maintain a digital archive of all sent documents.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'int-transfer',
    name: 'International Transfer',
    description: 'Transfer calls to international numbers',
    detailedDescription: 'Seamlessly transfer incoming calls to international phone numbers. Ideal for businesses with global teams or international clients. Supports over 150 countries with competitive per-minute rates.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'ivr',
    name: 'IVR',
    description: 'Interactive Voice Response system for call routing',
    detailedDescription: 'Create a professional automated phone system that greets callers and routes them to the right department. Customize greetings, menu options, and business hours. Reduce missed calls and improve customer experience.',
    price: 25,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'message-taking',
    name: 'Message Taking',
    description: 'Professional message taking service',
    detailedDescription: 'Our trained receptionists take detailed messages when you\'re unavailable. Messages are instantly delivered via email or SMS with caller information, message content, and urgency level. Never miss an important customer inquiry.',
    price: 50,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'message-transcription',
    name: 'Message Transcription',
    description: 'Voicemail messages transcribed to text',
    detailedDescription: 'Receive voicemail messages as text transcriptions delivered to your email. Quickly scan messages without listening to audio. Searchable archive makes it easy to find important information from past messages.',
    price: 5,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'supervised-transfer',
    name: 'Supervised Transfer',
    description: 'Announce callers before transferring',
    detailedDescription: 'Our receptionists will announce the caller before transferring the call to you. This allows you to decide whether to accept, decline, or take a message. Perfect for screening calls and maintaining professionalism.',
    price: 50,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'texting',
    name: 'Texting',
    description: 'Send and receive text messages from your business number',
    detailedDescription: 'Enable two-way SMS texting from your business phone number. Communicate with customers via text while keeping your personal number private. Manage conversations from your dashboard or mobile app.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'additional-extensions',
    name: 'Additional Extensions',
    description: 'Add more extensions to your phone system. Further customization available from Phone System page.',
    detailedDescription: 'Expand your phone system with additional extensions for team members or departments. Each extension gets a unique number and voicemail. Manage call routing and forwarding rules independently.',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
];

export const sampleLocations: AvailableLocation[] = [
  {
    id: 'loc-1',
    name: 'Brickell Tower',
    address: '848 Brickell Avenue, Penthouse 5',
    city: 'Miami',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33131',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
  {
    id: 'loc-2',
    name: 'Downtown Miami Center',
    address: '100 SE 2nd Street, Suite 400',
    city: 'Miami',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33131',
    imageUrl: '/placeholder-building.jpg',
    isPremium: false,
  },
  {
    id: 'loc-3',
    name: 'Coral Gables Executive',
    address: '2655 S Le Jeune Rd, Suite 300',
    city: 'Coral Gables',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33134',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
  {
    id: 'loc-4',
    name: 'Fort Lauderdale Business Center',
    address: '110 SE 6th Street, Suite 1700',
    city: 'Fort Lauderdale',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33301',
    imageUrl: '/placeholder-building.jpg',
    isPremium: false,
  },
  {
    id: 'loc-5',
    name: 'Manhattan Midtown',
    address: '1 Penn Plaza, Suite 6200',
    city: 'New York',
    state: 'New York',
    stateCode: 'NY',
    zipCode: '10119',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
  {
    id: 'loc-6',
    name: 'Wall Street Financial',
    address: '14 Wall Street, 20th Floor',
    city: 'New York',
    state: 'New York',
    stateCode: 'NY',
    zipCode: '10005',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
  {
    id: 'loc-7',
    name: 'Downtown LA Tower',
    address: '633 W 5th Street, Suite 2600',
    city: 'Los Angeles',
    state: 'California',
    stateCode: 'CA',
    zipCode: '90071',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
  {
    id: 'loc-8',
    name: 'Santa Monica Business Park',
    address: '2425 Olympic Blvd, Suite 4000',
    city: 'Santa Monica',
    state: 'California',
    stateCode: 'CA',
    zipCode: '90404',
    imageUrl: '/placeholder-building.jpg',
    isPremium: false,
  },
  {
    id: 'loc-9',
    name: 'Chicago Loop Center',
    address: '111 W Jackson Blvd, Suite 1700',
    city: 'Chicago',
    state: 'Illinois',
    stateCode: 'IL',
    zipCode: '60604',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
  {
    id: 'loc-10',
    name: 'Houston Galleria',
    address: '2929 Allen Parkway, Suite 200',
    city: 'Houston',
    state: 'Texas',
    stateCode: 'TX',
    zipCode: '77019',
    imageUrl: '/placeholder-building.jpg',
    isPremium: false,
  },
  {
    id: 'loc-11',
    name: 'Dallas Uptown',
    address: '3131 McKinney Ave, Suite 600',
    city: 'Dallas',
    state: 'Texas',
    stateCode: 'TX',
    zipCode: '75204',
    imageUrl: '/placeholder-building.jpg',
    isPremium: true,
  },
];

export const samplePhoneNumbers: PhoneNumber[] = [
  { id: 'pn-1', number: '(305) 555-1234', type: 'local', areaCode: '305', isAvailable: true },
  { id: 'pn-2', number: '(305) 555-5678', type: 'local', areaCode: '305', isAvailable: true },
  { id: 'pn-3', number: '(305) 555-9012', type: 'local', areaCode: '305', isAvailable: true },
  { id: 'pn-4', number: '(786) 555-3456', type: 'local', areaCode: '786', isAvailable: true },
  { id: 'pn-5', number: '(786) 555-7890', type: 'local', areaCode: '786', isAvailable: true },
  { id: 'pn-6', number: '(212) 555-1234', type: 'local', areaCode: '212', isAvailable: true },
  { id: 'pn-7', number: '(212) 555-5678', type: 'local', areaCode: '212', isAvailable: true },
  { id: 'pn-8', number: '(310) 555-1234', type: 'local', areaCode: '310', isAvailable: true },
  { id: 'pn-9', number: '(310) 555-5678', type: 'local', areaCode: '310', isAvailable: true },
  { id: 'pn-10', number: '(713) 555-1234', type: 'local', areaCode: '713', isAvailable: true },
];

export function getStates(): string[] {
  const states = [...new Set(sampleLocations.map(loc => loc.state))];
  return states.sort();
}

export function getCitiesByState(state: string): string[] {
  const cities = [...new Set(sampleLocations.filter(loc => loc.state === state).map(loc => loc.city))];
  return cities.sort();
}

export function getLocationsByCity(city: string): AvailableLocation[] {
  return sampleLocations.filter(loc => loc.city === city);
}

export function getPhoneNumbersForLocation(location: AvailableLocation): PhoneNumber[] {
  const areaCodeMap: Record<string, string[]> = {
    'FL': ['305', '786'],
    'NY': ['212'],
    'CA': ['310'],
    'TX': ['713'],
    'IL': ['312'],
  };
  const areaCodes = areaCodeMap[location.stateCode] || ['305'];
  return samplePhoneNumbers.filter(pn => areaCodes.includes(pn.areaCode));
}
