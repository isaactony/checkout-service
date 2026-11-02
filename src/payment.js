import { createCharge } from './sandboxProvider.js';

const TIMEOUT_MS = 5000;

export class PaymentError extends Error {
  constructor(reason) {
    super(`payment failed: ${reason}`);
    this.reason = reason;
  }
}

export async function charge(amountCents, currency) {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new PaymentError('invalid_amount');
  }
  return createCharge({ amountCents, currency }, { timeoutMs: TIMEOUT_MS });
}
