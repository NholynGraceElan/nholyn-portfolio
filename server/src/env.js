import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SERVER_ROOT = path.resolve(__dirname, '..');
export const ENV_PATH = path.join(SERVER_ROOT, '.env');
export const DATA_DIR = path.join(SERVER_ROOT, 'data');
export const KEYS_DIR = path.join(SERVER_ROOT, 'keys');
export const CREDENTIALS_PATH = path.join(KEYS_DIR, 'admin-credentials.txt');

function readEnvMap() {
  const map = {};
  if (!fs.existsSync(ENV_PATH)) return map;
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    map[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return map;
}

export function bootstrapEnv() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(KEYS_DIR, { recursive: true });

  const env = readEnvMap();
  const additions = [];
  let printedPassword = null;

  if (!env.JWT_SECRET && !process.env.JWT_SECRET) {
    const secret = crypto.randomBytes(32).toString('hex');
    additions.push(`JWT_SECRET=${secret}`);
    console.log('[env] Generated JWT_SECRET (new).');
  }

  if (!env.ENCRYPTION_KEY && !process.env.ENCRYPTION_KEY) {
    const key = crypto.randomBytes(32).toString('hex');
    additions.push(`ENCRYPTION_KEY=${key}`);
    console.log('[env] Generated ENCRYPTION_KEY (AES-256-GCM).');
  }

  if (!env.ADMIN_USERNAME) {
    additions.push('ADMIN_USERNAME=nholyn');
  }

  if (!env.ADMIN_PASSWORD_HASH) {
    const password = crypto.randomBytes(5).toString('base64url');
    const hash = bcrypt.hashSync(password, 12);
    additions.push(`ADMIN_PASSWORD_HASH=${hash}`);
    const credentials =
      `Nholyn Portfolio — admin inbox\n` +
      `Generated: ${new Date().toISOString()}\n` +
      `Username : nholyn\n` +
      `Password : ${password}\n` +
      `Keep this file private. Delete it after you save the password somewhere safe.\n`;
    fs.writeFileSync(CREDENTIALS_PATH, credentials, { mode: 0o600 });
    printedPassword = password;
    console.log('[env] Generated admin credentials -> server/keys/admin-credentials.txt');
  }

  if (additions.length) {
    fs.appendFileSync(ENV_PATH, '\n' + additions.join('\n') + '\n');
  }

  if (printedPassword) {
    console.log(`\n  ╭──────────────────────────────────────────────╮`);
    console.log(`  │  ADMIN INBOX  user: nholyn                    │`);
    console.log(`  │  password: ${printedPassword.padEnd(35)}│`);
    console.log(`  ╰──────────────────────────────────────────────╯\n`);
  }
}

export function getEnv(key, fallback = '') {
  return process.env[key] || fallback;
}
