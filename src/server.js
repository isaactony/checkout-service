import http from 'node:http';
import { checkout } from './checkout.js';

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

  try {
    const order = await readJson(req);
    send(res, 200, await checkout(order));
  } catch (err) {
    send(res, 500, { error: 'checkout_failed' });
  }
});

server.listen(PORT, () => console.log(`checkout-service listening on :${PORT}`));
