import { computeTotal } from './pricing.js';
import { charge } from './payment.js';

export async function checkout(order) {
  const { items, country, currency = 'USD' } = order;
  const total = computeTotal({ items, country });
  const payment = await charge(Math.round(total * 100), currency);
  return { status: 'paid', total, paymentId: payment.id };
}
