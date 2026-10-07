export type TruckingProgramId = 'essentials' | 'pro' | 'works';

// Source: Opus_Trucking_Plans(Sheet4_(3))_1791404015280.csv.
export const truckingSharedFeatures = [
  'Professional Business Address',
  'Digital Trucking Compliance Vault',
  'Mail Receipt & Forwarding',
  'Digital Mail Notification by MailX',
  'FMCSA & Inspector Meeting Room Access (5 hours/mo)',
  'Business Occupancy Agreement',
  'Registered Agent Services',
] as const;

export const truckingProFeatures = [
  'Professional Live Call Answering',
  'Business Phone & Fax Numbers',
  'Personalized Call Transferring',
  'Business Number Callout App',
  'Voicemail/Fax Converted to Email',
  'Call History & Activity Logs',
] as const;

export const truckingWorksFeatures = [
  'Dedicated Toll-Free Business Number',
  'Live Message Taking',
  'Business Text Messaging',
  'Professional Business Email Address',
] as const;

export const truckingPrograms = [
  {
    id: 'essentials',
    name: 'Opus Trucking - The Essential',
    label: 'The Essential',
    description: 'Your business address, mail and compliance essentials.',
    monthly: 129,
    featureCount: 7,
  },
  {
    id: 'pro',
    name: 'Opus Trucking - The Pro',
    label: 'The Pro',
    description: 'Your essentials, plus professional call handling on the road.',
    monthly: 179,
    featureCount: 13,
  },
  {
    id: 'works',
    name: 'Opus Trucking - The Works',
    label: 'The Works',
    description: 'Your essentials and call handling, with more ways to connect.',
    monthly: 239,
    featureCount: 17,
  },
] as const;
