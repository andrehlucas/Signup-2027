import { completeSignup } from './signup';
import type { IStorage } from './storage';

const checkoutUnavailableMessage = 'Checkout is not connected yet. Please try again later.';

type CheckoutPreparationResult =
  | { status: 201; body: { status: 'checkout_ready'; checkoutUrl: string; signupId: string } }
  | { status: 400; body: { message: string; errors?: Record<string, string> } }
  | { status: 409; body: { message: string } }
  | { status: 503; body: { message: string } };

function isValidCheckoutUrl(destination: string): boolean {
  if (!/^https:\/\//i.test(destination) || /[\u0000-\u0020\u007f\\]/.test(destination)) {
    return false;
  }

  try {
    const url = new URL(destination);
    const authority = destination.slice(destination.indexOf('://') + 3).split(/[/?#]/, 1)[0];
    return url.protocol === 'https:'
      && Boolean(url.hostname)
      && !url.username
      && !url.password
      && !authority.includes('@');
  } catch {
    return false;
  }
}

export async function prepareCheckout(
  storage: IStorage,
  input: unknown,
  checkoutUrl: string | undefined = process.env.PHP_CHECKOUT_URL,
): Promise<CheckoutPreparationResult> {
  if (!checkoutUrl || !isValidCheckoutUrl(checkoutUrl)) {
    return { status: 503, body: { message: checkoutUnavailableMessage } };
  }

  const result = await completeSignup(storage, input);
  if (result.status !== 201) {
    return result;
  }

  return {
    status: 201,
    body: {
      status: 'checkout_ready',
      checkoutUrl,
      signupId: result.body.id,
    },
  };
}