// One JSON object per line, to stdout and (if LOG_FILE is set) to a file.
import { appendFileSync } from 'node:fs';

const { LOG_FILE } = process.env;
const VERSION = process.env.npm_package_version ?? 'dev';

export function log(level, event, fields = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, service: 'checkout', version: VERSION, event, ...fields });
  console.log(line);
  if (LOG_FILE) appendFileSync(LOG_FILE, line + '\n');
}
