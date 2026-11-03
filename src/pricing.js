import { TAX_RATES } from './taxRates.js';
import { applyCoupon } from './coupons.js';

export function computeTotal({ items, country, couponCode }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discounted = applyCoupon(subtotal, couponCode);
  // Mobile clients send lowercase ISO codes ("gb"), web sends "GB".
  const rate = TAX_RATES[country.toUpperCase()] ?? 0;
  return Math.round(discounted * (1 + rate) * 100) / 100;
}
