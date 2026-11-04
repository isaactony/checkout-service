import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTotal } from '../src/pricing.js';
import { checkout } from '../src/checkout.js';

const cart = [{ sku: 'TSHIRT', unitPrice: 10, quantity: 2 }];

test('sums the cart', () => {
  assert.equal(computeTotal({ items: cart, country: 'US' }), 20);
});

test('adds VAT for the country', () => {
  assert.equal(computeTotal({ items: cart, country: 'GB' }), 24);
  assert.equal(computeTotal({ items: cart, country: 'DE' }), 23.8);
});

test('checkout charges the customer', async () => {
  const result = await checkout({ items: cart, country: 'US' });
  assert.equal(result.status, 'paid');
  assert.match(result.paymentId, /^pay_/);
});

test('applies coupons before tax', () => {
  assert.equal(computeTotal({ items: cart, country: 'GB', couponCode: 'SAVE10' }), 21.6);
  assert.equal(computeTotal({ items: cart, country: 'US', couponCode: 'WELCOME5' }), 15);
});

test('rejects an empty cart', async () => {
  await assert.rejects(checkout({ items: [], country: 'US' }), /cart is empty/);
});
