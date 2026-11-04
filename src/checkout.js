import { computeTotal } from './pricing.js';
import { validateCart } from './cart.js';
import { charge } from './payment.js';

export async function checkout(order) {
  const { items, country, couponCode, currency = 'USD' } = order;
  validateCart(items);
  const total = computeTotal({ items, country, couponCode });
  const payment = await charge(Math.round(total * 100), currency);
  return { status: 'paid', total, paymentId: payment.id };
}
