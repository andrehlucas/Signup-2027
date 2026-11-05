export interface AvailableLocation {
  id: string;
  name: string;
  address: string;
  addressLine2: string;
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
    businessPhoneFax: boolean;
    mailReceipt: boolean;
    voicemailToEmail: boolean;
    calloutFeature: boolean;
    tollFreeNumber: boolean;
    callLog: boolean;
    supervisedCallTransfer: boolean;
    messageTaking: boolean;
    appointmentMaking: boolean;
  };
}

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'local' | 'toll-free';
  areaCode: string;
  isAvailable: boolean;
}

export interface AddonPackage {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  price: number;
  billingCycle: 'monthly' | 'one-time';
  category: string;
  packages?: AddonPackage[];
  selectedPackage?: AddonPackage;
}

export interface CartItem {
  id: string;
  type: 'bundle' | 'addon' | 'location';
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'one-time';
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  countryRegion: string;
  email: string;
  confirmEmail: string;
  company: string;
  termsAccepted: boolean;
}

export interface OrderState {
  userInfo: UserInfo;
  location: AvailableLocation | null;
  bundle: Bundle | null;
  phoneNumber: PhoneNumber | null;
  tollFreePhoneNumber: PhoneNumber | null;
  addons: Addon[];
  extensionCount: number;
  agreementAccepted: boolean;
  appliedPromo: AppliedPromo | null;
}

export const bundles: Bundle[] = [
  {
    id: 'essentials',
    name: 'The Ultimate Office Solution',
    tier: 'The Essentials',
    price: 99,
    badge: 'The Essentials',
    badgeColor: 'bg-gray-100',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      businessPhoneFax: true,
      mailReceipt: true,
      voicemailToEmail: true,
      calloutFeature: false,
      tollFreeNumber: false,
      callLog: false,
      supervisedCallTransfer: false,
      messageTaking: false,
      appointmentMaking: false,
    },
  },
  {
    id: 'plus',
    name: 'The Ultimate Office',
    tier: 'PLUS',
    price: 119,
    originalPrice: 129,
    badge: 'Popular Upgrades',
    badgeColor: 'bg-gray-100',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      businessPhoneFax: true,
      mailReceipt: true,
      voicemailToEmail: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: false,
      messageTaking: false,
      appointmentMaking: false,
    },
  },
  {
    id: 'pro',
    name: 'The Ultimate Office',
    tier: 'PRO',
    price: 149,
    originalPrice: 179,
    badge: 'The Professional',
    badgeColor: 'bg-gray-100',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      businessPhoneFax: true,
      mailReceipt: true,
      voicemailToEmail: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: false,
      appointmentMaking: false,
    },
  },
  {
    id: 'premium',
    name: 'The Ultimate Office',
    tier: 'PREMIUM',
    price: 179,
    originalPrice: 229,
    badge: 'The Best Value',
    badgeColor: 'bg-gray-100',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      businessPhoneFax: true,
      mailReceipt: true,
      voicemailToEmail: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: true,
      appointmentMaking: false,
    },
  },
  {
    id: 'prestige',
    name: 'The Ultimate Office',
    tier: 'PLATINUM',
    price: 199,
    originalPrice: 279,
    badge: 'The Platinum',
    badgeColor: 'bg-gray-100',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      businessPhoneFax: true,
      mailReceipt: true,
      voicemailToEmail: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: false,
      appointmentMaking: true,
    },
  },
];

export type PromoCodeType = 'percentage' | 'flat' | 'free_months';

export interface PromoCode {
  code: string;
  type: PromoCodeType;
  value: number;
  description: string;
  minOrderAmount?: number;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
}

export interface AppliedPromo {
  code: string;
  type: PromoCodeType;
  value: number;
  description: string;
  discountAmount: number;
}

export const promoCodes: PromoCode[] = [
  {
    code: 'SAVE20',
    type: 'percentage',
    value: 20,
    description: '20% off your first payment',
    currentUses: 0,
    maxUses: 100,
  },
  {
    code: 'FLAT50',
    type: 'flat',
    value: 50,
    description: '$50 off your order',
    currentUses: 0,
  },
  {
    code: 'FREEMONTH',
    type: 'free_months',
    value: 1,
    description: '1 free month added',
    currentUses: 0,
    maxUses: 50,
  },
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: '10% off for new customers',
    currentUses: 0,
  },
  {
    code: 'OPUS100',
    type: 'flat',
    value: 100,
    description: '$100 off your order',
    minOrderAmount: 300,
    currentUses: 0,
  },
];

export function validatePromoCode(
  code: string,
  monthlyTotal: number,
  paymentTerm: number
): { valid: boolean; promo?: PromoCode; error?: string } {
  const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());

  if (!promo) {
    return { valid: false, error: 'Invalid promo code' };
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { valid: false, error: 'This promo code has expired' };
  }

  if (promo.maxUses !== undefined && promo.currentUses >= promo.maxUses) {
    return { valid: false, error: 'This promo code has reached its usage limit' };
  }

  const orderTotal = monthlyTotal * paymentTerm;
  if (promo.minOrderAmount && orderTotal < promo.minOrderAmount) {
    return { valid: false, error: `Minimum order of $${promo.minOrderAmount} required` };
  }

  return { valid: true, promo };
}

export function calculatePromoDiscount(
  promo: PromoCode,
  monthlyTotal: number,
  paymentTerm: number
): number {
  switch (promo.type) {
    case 'percentage':
      return Math.round((monthlyTotal * paymentTerm * promo.value) / 100 * 100) / 100;
    case 'flat':
      return Math.min(promo.value, monthlyTotal * paymentTerm);
    case 'free_months':
      return monthlyTotal * Math.min(promo.value, paymentTerm);
    default:
      return 0;
  }
}

export const featureLabels: Record<string, string> = {
  businessAddress: 'Prestigious Business Address',
  liveCallAnswering: 'Professional Live Call Answering',
  callTransferring: 'Personalized Call Transferring',
  businessPhoneFax: 'Business Phone/Fax Number',
  mailReceipt: 'Professional Mail Receipt',
  voicemailToEmail: 'Voicemail/Fax Converted to Email',
  calloutFeature: 'Callout Feature',
  tollFreeNumber: 'Toll-Free Number',
  callLog: 'Call Log',
  supervisedCallTransfer: 'Supervised Call Transfer',
  messageTaking: 'Message Taking',
  appointmentMaking: 'Appointment Making',
};

// Maps add-on IDs to their corresponding bundle feature keys
// This is used to determine if an add-on is included in a bundle
export const addonToFeatureMap: Record<string, keyof Bundle['features']> = {
  'toll-free': 'tollFreeNumber',
  'callout': 'calloutFeature',
  'call-log': 'callLog',
  'supervised-transfer': 'supervisedCallTransfer',
  'message-taking': 'messageTaking',
  'appointment-scheduling': 'appointmentMaking',
};

// Add-on status types
export type AddonStatus = 'available' | 'active' | 'included';

// Individual feature prices - used when calculating price after removing bundle features
// These are the a-la-carte prices if someone wants a feature without a bundle
export const featureIndividualPrices: Record<keyof Bundle['features'], number> = {
  businessAddress: 0,
  liveCallAnswering: 0,
  callTransferring: 0,
  businessPhoneFax: 0,
  mailReceipt: 0,
  voicemailToEmail: 0,
  calloutFeature: 10,
  tollFreeNumber: 10,
  callLog: 10,
  supervisedCallTransfer: 50,
  messageTaking: 50,
  appointmentMaking: 100,
};

// Essentials plan (base plan) information
export const ESSENTIALS_PLAN = {
  id: 'essentials',
  name: 'The Essentials',
  price: 99,
};

// Helper function to calculate new price when removing a bundle feature
// Returns: Essentials base price + sum of individual prices for remaining features
export function calculatePriceAfterRemoval(
  currentBundle: Bundle,
  featureToRemove: keyof Bundle['features']
): { newPrice: number; breakdown: { name: string; price: number }[] } {
  const breakdown: { name: string; price: number }[] = [
    { name: 'The Essentials (Base Plan)', price: ESSENTIALS_PLAN.price }
  ];

  // Get all features that are currently included in the bundle (excluding the one being removed)
  const remainingFeatures = Object.entries(currentBundle.features)
    .filter(([key, value]) => 
      value === true && 
      key !== featureToRemove &&
      featureIndividualPrices[key as keyof Bundle['features']] > 0
    );

  // Add each remaining feature with its individual price
  remainingFeatures.forEach(([key]) => {
    const featureKey = key as keyof Bundle['features'];
    const price = featureIndividualPrices[featureKey];
    if (price > 0) {
      breakdown.push({
        name: featureLabels[key] || key,
        price
      });
    }
  });

  const newPrice = breakdown.reduce((sum, item) => sum + item.price, 0);

  return { newPrice, breakdown };
}

// Helper function to get bundle by ID
export function getBundleById(bundleId: string): Bundle | undefined {
  return bundles.find(b => b.id === bundleId);
}

// Helper function to check if an add-on is included in a bundle
export function isAddonIncludedInBundle(addonId: string, bundle: Bundle | null): boolean {
  if (!bundle) return false;
  const featureKey = addonToFeatureMap[addonId];
  if (!featureKey) return false;
  return bundle.features[featureKey] === true;
}

// Helper function to get list of included add-on IDs for a bundle
export function getIncludedAddonIds(bundle: Bundle | null): string[] {
  if (!bundle) return [];
  return Object.entries(addonToFeatureMap)
    .filter(([_, featureKey]) => bundle.features[featureKey] === true)
    .map(([addonId]) => addonId);
}

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
    price: 25,
    billingCycle: 'monthly',
    category: 'phone',
  },
  {
    id: 'appointment-scheduling',
    name: 'Appointment Scheduling',
    description: 'Professional appointment booking handled by our receptionists',
    detailedDescription: 'Let our trained receptionists manage your appointment scheduling. They will answer calls, check your calendar availability, and book appointments on your behalf. Perfect for medical offices, salons, consultants, and service businesses.',
    price: 100,
    billingCycle: 'monthly',
    category: 'phone',
    packages: [
      { id: 'apt-20', name: '20 Appointments/Month', quantity: 20, price: 100 },
      { id: 'apt-40', name: '40 Appointments/Month', quantity: 40, price: 200 },
      { id: 'apt-60', name: '60 Appointments/Month', quantity: 60, price: 300 },
      { id: 'apt-100', name: '100 Appointments/Month', quantity: 100, price: 400 },
      { id: 'apt-200', name: '200 Appointments/Month', quantity: 200, price: 800 },
    ],
  },
];

export const sampleLocations: AvailableLocation[] = [
  {
    id: 'loc-1285',
    name: 'Miami - Brickell Avenue',
    address: '848 Brickell Avenue',
    addressLine2: 'PH5',
    city: 'Miami',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33131',
    imageUrl: '/attached_assets/miami-office.webp',
    isPremium: true,
  },
  {
    id: 'loc-776',
    name: 'Boca Raton - Corporate Blvd',
    address: '1825 NW Corporate Blvd',
    addressLine2: 'Suite 110',
    city: 'Boca Raton',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33431',
    imageUrl: '/attached_assets/boca-raton-office.webp',
    isPremium: true,
  },
  {
    id: 'loc-803',
    name: 'Fort Lauderdale - Las Olas',
    address: '515 E Las Olas Boulevard',
    addressLine2: 'Suite 1301',
    city: 'Fort Lauderdale',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33301',
    imageUrl: '/attached_assets/fort-lauderdale-office.jpg',
    isPremium: true,
  },
  {
    id: 'loc-1499',
    name: 'Orlando - Robinson Street',
    address: '200 E Robinson Street',
    addressLine2: 'Suite 1120',
    city: 'Orlando',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '32801',
    imageUrl: '/attached_assets/orlando-office.webp',
    isPremium: true,
  },
  {
    id: 'loc-885',
    name: 'Tampa - Truist Place',
    address: '401 East Jackson Street',
    addressLine2: 'Suite 2340',
    city: 'Tampa',
    state: 'Florida',
    stateCode: 'FL',
    zipCode: '33602',
    imageUrl: '/attached_assets/tampa-office.webp',
    isPremium: true,
  },
];

export const samplePhoneNumbers: PhoneNumber[] = [
  { id: 'pn-1', number: '(305) 847-9001', type: 'local', areaCode: '305', isAvailable: true },
  { id: 'pn-2', number: '(305) 847-9002', type: 'local', areaCode: '305', isAvailable: true },
  { id: 'pn-3', number: '(305) 847-9003', type: 'local', areaCode: '305', isAvailable: true },
  { id: 'pn-4', number: '(561) 988-6901', type: 'local', areaCode: '561', isAvailable: true },
  { id: 'pn-5', number: '(561) 988-6902', type: 'local', areaCode: '561', isAvailable: true },
  { id: 'pn-6', number: '(954) 903-3101', type: 'local', areaCode: '954', isAvailable: true },
  { id: 'pn-7', number: '(954) 903-3102', type: 'local', areaCode: '954', isAvailable: true },
  { id: 'pn-8', number: '(407) 559-2001', type: 'local', areaCode: '407', isAvailable: true },
  { id: 'pn-9', number: '(407) 559-2002', type: 'local', areaCode: '407', isAvailable: true },
  { id: 'pn-10', number: '(813) 315-3991', type: 'local', areaCode: '813', isAvailable: true },
  { id: 'pn-11', number: '(813) 315-3992', type: 'local', areaCode: '813', isAvailable: true },
];

export const sampleTollFreeNumbers: PhoneNumber[] = [
  { id: 'tf-1', number: '(800) 555-1234', type: 'toll-free', areaCode: '800', isAvailable: true },
  { id: 'tf-2', number: '(800) 555-5678', type: 'toll-free', areaCode: '800', isAvailable: true },
  { id: 'tf-3', number: '(888) 555-1234', type: 'toll-free', areaCode: '888', isAvailable: true },
  { id: 'tf-4', number: '(888) 555-5678', type: 'toll-free', areaCode: '888', isAvailable: true },
  { id: 'tf-5', number: '(877) 555-1234', type: 'toll-free', areaCode: '877', isAvailable: true },
  { id: 'tf-6', number: '(866) 555-1234', type: 'toll-free', areaCode: '866', isAvailable: true },
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

export function getLocationsByState(state: string): AvailableLocation[] {
  return sampleLocations.filter(loc => loc.state === state);
}

export function getPhoneNumbersForLocation(location: AvailableLocation): PhoneNumber[] {
  const cityAreaCodeMap: Record<string, string[]> = {
    'Miami': ['305'],
    'Boca Raton': ['561'],
    'Fort Lauderdale': ['954'],
    'Orlando': ['407'],
    'Tampa': ['813'],
  };
  const areaCodes = cityAreaCodeMap[location.city] || ['305'];
  return samplePhoneNumbers.filter(pn => areaCodes.includes(pn.areaCode));
}
