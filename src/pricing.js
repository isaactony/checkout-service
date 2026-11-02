export function computeTotal({ items }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return Math.round(subtotal * 100) / 100;
}
