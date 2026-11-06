import { TAX_RATES } from './taxRates.js';
import { applyCoupon } from './coupons.js';

// Computed once at startup rather than on every request.
const TAX_MULTIPLIER = Object.fromEntries(
  Object.entries(TAX_RATES).map(([country, rate]) => [country, 1 + rate]),
);

export function computeTotal({ items, country, couponCode }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discounted = applyCoupon(subtotal, couponCode);
  return Math.round(discounted * TAX_MULTIPLIER[country] * 100) / 100;
}
