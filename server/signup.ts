import { createHash } from 'crypto';
import { z } from 'zod';
import { sampleLocations } from '../app/add-location/types';
import { truckingPrograms } from '../shared/trucking-programs';
import type { IStorage } from './storage';

const signupRequestSchema = z.object({
  requestId: z.string().uuid('A valid request ID is required.').transform((requestId) => requestId.toLowerCase()),
  userInfo: z.object({
    firstName: z.string().trim().min(1, 'Enter your first name.').max(100, 'First name is too long.'),
    lastName: z.string().trim().min(1, 'Enter your last name.').max(100, 'Last name is too long.'),
    phone: z.string()
      .trim()
      .min(1, 'Enter your phone number.')
      .max(32, 'Phone number is too long.')
      .regex(/^[+\d\s().-]+$/, 'Enter a valid phone number.')
      .refine((phone) => (phone.match(/\d/g) ?? []).length >= 5, 'Enter a valid phone number.'),
    countryCode: z.string().trim().min(1, 'Choose a country code.').max(8, 'Country code is too long.'),
    email: z.string().trim().min(1, 'Enter your email address.').max(254, 'Email address is too long.').email('Enter a valid email address.'),
    confirmEmail: z.string().trim().min(1, 'Confirm your email address.').max(254, 'Email address is too long.').email('Enter a valid email address.'),
    company: z.string().trim().min(1, 'Enter your company name.').max(150, 'Company name is too long.'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue.' }),
    }),
  }).strict(),
  locationId: z.string().trim().min(1, 'Choose a location.').max(80, 'Location is invalid.'),
  programId: z.enum(['essentials', 'pro', 'works'], {
    required_error: 'Choose a program.',
    invalid_type_error: 'Choose a valid program.',
  }),
  billing: z.enum(['monthly', 'annual'], {
    required_error: 'Choose a billing option.',
    invalid_type_error: 'Choose a valid billing option.',
  }),
}).strict();

export type SignupCompletionResult =
  | { status: 201; body: { id: string; status: 'completed'; createdAt: string } }
  | { status: 400; body: { message: string; errors?: Record<string, string> } }
  | { status: 409; body: { message: string } };

export async function completeSignup(storage: IStorage, input: unknown): Promise<SignupCompletionResult> {
  const parsed = signupRequestSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join('.');
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return {
      status: 400,
      body: { message: 'Please check your information and try again.', errors },
    };
  }

  const { requestId } = parsed.data;
  const { userInfo, locationId, programId, billing } = parsed.data;
  if (userInfo.email.toLowerCase() !== userInfo.confirmEmail.toLowerCase()) {
    return {
      status: 400,
      body: {
        message: 'Please check your information and try again.',
        errors: { 'userInfo.confirmEmail': 'Email addresses do not match.' },
      },
    };
  }

  if (!sampleLocations.some((location) => location.id === locationId)) {
    return {
      status: 400,
      body: {
        message: 'The selected location is unavailable. Please choose another location.',
        errors: { locationId: 'Choose an available location.' },
      },
    };
  }

  const normalizedUserInfo = {
    ...userInfo,
    email: userInfo.email.toLowerCase(),
    confirmEmail: userInfo.confirmEmail.toLowerCase(),
  };
  const program = truckingPrograms.find((candidate) => candidate.id === programId)!;
  const quotedPrice = billing === 'monthly' ? program.monthly : program.annualTotal;
  const requestFingerprint = createHash('sha256')
    .update(JSON.stringify({ userInfo: normalizedUserInfo, locationId, programId, billing }))
    .digest('hex');

  const result = await storage.createSignup({
    requestId,
    requestFingerprint,
    firstName: normalizedUserInfo.firstName,
    lastName: normalizedUserInfo.lastName,
    phone: normalizedUserInfo.phone,
    countryCode: normalizedUserInfo.countryCode,
    email: normalizedUserInfo.email,
    company: normalizedUserInfo.company,
    termsAccepted: true,
    locationId,
    programId,
    billing,
    quotedMonthlyPrice: program.monthly,
    quotedAnnualTotal: program.annualTotal,
    quotedPrice,
  });

  if (result.conflict || !result.signup) {
    return { status: 409, body: { message: 'This request ID was already used for a different signup.' } };
  }

  return {
    status: 201,
    body: {
      id: result.signup.id,
      status: 'completed',
      createdAt: result.signup.createdAt,
    },
  };
}