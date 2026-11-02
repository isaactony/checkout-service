import { TAX_RATES } from './taxRates.js';

export function computeTotal({ items, country }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  // Mobile clients send lowercase ISO codes ("gb"), web sends "GB".
  const rate = TAX_RATES[country.toUpperCase()] ?? 0;
  return Math.round(subtotal * (1 + rate) * 100) / 100;
}
