export class ValidationError extends Error {}

export function validateCart(items) {
  if (!Array.isArray(items) || items.length === 0) throw new ValidationError('cart is empty');
  for (const item of items) {
    if (!item.sku) throw new ValidationError('item is missing a sku');
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new ValidationError(`invalid quantity for ${item.sku}`);
    }
    if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
      throw new ValidationError(`invalid price for ${item.sku}`);
    }
  }
}
