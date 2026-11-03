const COUPONS = {
  SAVE10: { type: 'percent', value: 10 },
  WELCOME5: { type: 'fixed', value: 5 },
};

export function applyCoupon(subtotal, code) {
  if (!code) return subtotal;
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return subtotal;
  if (coupon.type === 'percent') return subtotal * (1 - coupon.value / 100);
  return Math.max(0, subtotal - coupon.value);
}
