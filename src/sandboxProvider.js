// In-process stand-in for the payment provider's sandbox API.
import { randomUUID } from 'node:crypto';

export async function createCharge({ amountCents, currency }, { timeoutMs }) {
  if (timeoutMs <= 0) throw new Error('timeout');
  return { id: `pay_${randomUUID().replaceAll('-', '').slice(0, 14)}`, amountCents, currency };
}
