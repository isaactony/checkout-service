import { TAX_RATES } from './taxRates.js';
import { applyCoupon } from './coupons.js';

// Computed once at startup rather than on every request.
const TAX_MULTIPLIER = Object.fromEntries(
  Object.entries(TAX_RATES).map(([country, rate]) => [country, 1 + rate]),
);

export function computeTotal({ items, country, couponCode }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discounted = applyCoupon(subtotal, couponCode);
  // Mobile clients send lowercase ISO codes ("gb"), web sends "GB".
  const multiplier = TAX_MULTIPLIER[country.toUpperCase()] ?? 1;
  return Math.round(discounted * multiplier * 100) / 100;
}
