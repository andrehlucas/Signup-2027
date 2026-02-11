import { NextResponse } from 'next/server';
import { validatePromoCode, calculatePromoDiscount } from '@/app/add-location/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, monthlyTotal, paymentTerm } = body as {
      code: string;
      monthlyTotal: number;
      paymentTerm: number;
    };

    if (!code || monthlyTotal === undefined || !paymentTerm) {
      return NextResponse.json(
        { valid: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = validatePromoCode(code, monthlyTotal, paymentTerm);

    if (!result.valid || !result.promo) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 200 }
      );
    }

    const discountAmount = calculatePromoDiscount(result.promo, monthlyTotal, paymentTerm);

    return NextResponse.json({
      valid: true,
      promo: {
        code: result.promo.code,
        type: result.promo.type,
        value: result.promo.value,
        description: result.promo.description,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
