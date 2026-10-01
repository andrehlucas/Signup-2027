export type TruckingProgramId = 'essentials' | 'pro';
export type ProgramBilling = 'monthly' | 'annual';

export const truckingPrograms = [
  {
    id: 'essentials',
    name: 'Opus Trucking Essentials',
    label: 'Essentials',
    description: 'A professional business base, wherever the road takes you.',
    monthly: 199,
    annualTotal: 1990,
    meetingHours: 5,
  },
  {
    id: 'pro',
    name: 'Opus Trucking Pro',
    label: 'Pro',
    description: 'More ways to stay connected, with extra room to meet.',
    monthly: 249,
    annualTotal: 2490,
    meetingHours: 10,
  },
] as const;

export const truckingSharedFeaturesSummary =
  'Business Address, Live Call Answering, Call Transferring, Callout, Toll-Free, Call Logs, Mail Receipt, Digital Mail Scanning, and Occupancy Agreement.';

export const truckingProOnlyFeatures = [
  'Texting',
  'Custom Business Email',
  'Message Taking',
] as const;