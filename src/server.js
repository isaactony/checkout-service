import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { checkout } from './checkout.js';
import { PaymentError } from './payment.js';
import { ValidationError } from './cart.js';
import { log } from './logger.js';

const PORT = Number(process.env.PORT ?? 3000);

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (err) { reject(err); }
    });
  });
}

function send(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true });
  if (req.method !== 'POST' || req.url !== '/checkout') return send(res, 404, { error: 'not_found' });

  const started = Date.now();
  const orderId = `ord_${randomUUID().replaceAll('-', '').slice(0, 10)}`;
  let order = {};
  try {
    order = await readJson(req);
    const result = await checkout(order);
    log('info', 'checkout_succeeded', {
      orderId, client: order.client ?? 'web', country: order.country,
      items: order.items.length, total: result.total, durationMs: Date.now() - started,
    });
    send(res, 200, { orderId, ...result });
  } catch (err) {
    if (err instanceof ValidationError) {
      log('warn', 'checkout_rejected', { orderId, client: order.client ?? 'web', message: err.message, status: 400 });
      return send(res, 400, { orderId, error: 'invalid_cart', message: err.message });
    }
    const reason = err instanceof PaymentError ? err.reason : 'internal_error';
    log('error', 'checkout_failed', {
      orderId, client: order.client ?? 'web', country: order.country,
      reason, message: err.message, status: 500, durationMs: Date.now() - started,
    });
    send(res, 500, { orderId, error: 'checkout_failed' });
  }
});

server.listen(PORT, () => log('info', 'started', { port: PORT }));
