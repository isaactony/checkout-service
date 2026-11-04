import { createCharge } from './sandboxProvider.js';

const TIMEOUT_MS = 8000; // provider p99 is ~6s at peak

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
