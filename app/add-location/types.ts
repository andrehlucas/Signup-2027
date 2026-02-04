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
    price: 15,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'callout',
    name: 'Callout',
    description: 'Outbound calling capability from your business line',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'texting',
    name: 'Texting',
    description: 'Send and receive text messages from your business number',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'audio-conference',
    name: 'Audio Conference Bridge',
    description: 'Host conference calls with multiple participants',
    price: 25,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'additional-extension',
    name: 'Additional Extension',
    description: 'Add more extensions or voice boxes to your account',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'call-recording',
    name: 'Call Recording',
    description: 'Record incoming and outgoing calls for your records',
    price: 15,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'call-log',
    name: 'Incoming Call Log Feature',
    description: 'Detailed logs of all incoming calls',
    price: 10,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'supervised-transfer',
    name: 'Supervised Call Transfer',
    description: 'Announce callers before transferring',
    price: 15,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'message-taking',
    name: 'Message Taking',
    description: 'Professional message taking service',
    price: 20,
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
