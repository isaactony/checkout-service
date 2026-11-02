import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTotal } from '../src/pricing.js';
import { checkout } from '../src/checkout.js';

const cart = [{ sku: 'TSHIRT', unitPrice: 10, quantity: 2 }];

test('sums the cart', () => {
  assert.equal(computeTotal({ items: cart, country: 'US' }), 20);
});

test('checkout charges the customer', async () => {
  const result = await checkout({ items: cart, country: 'US' });
  assert.equal(result.status, 'paid');
  assert.match(result.paymentId, /^pay_/);
});
