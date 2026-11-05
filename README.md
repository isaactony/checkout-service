# checkout-service

Prices a cart and charges the customer. Runs on Node 20+, no dependencies.

    npm start      # listens on :3000
    npm test

Set `LOG_FILE=logs/checkout.log` to also write logs to a file.

## API

`POST /checkout`

```json
{
  "items": [{ "sku": "TSHIRT", "unitPrice": 10, "quantity": 2 }],
  "country": "GB",
  "currency": "GBP",
  "couponCode": "SAVE10",
  "client": "web"
}
```

- `country` is an ISO 3166-1 alpha-2 code. The iOS and Android apps send it lowercase.
- `client` is `web`, `ios` or `android`.

Returns `200 { orderId, status: "paid", total, paymentId }`, `400` for an invalid cart,
or `500 { error: "checkout_failed" }` if the charge fails.

`GET /health` returns `200 { ok: true }`.

## Logs

One JSON object per line: `checkout_succeeded`, `checkout_rejected` (400) and
`checkout_failed` (500, with a `reason` from the payment client).
