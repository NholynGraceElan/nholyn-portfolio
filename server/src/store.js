import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './env.js';

const FILE = path.join(DATA_DIR, 'messages.jsonl');

export function appendMessage(entry) {
  fs.appendFileSync(FILE, JSON.stringify(entry) + '\n', { mode: 0o600 });
}

export function readMessages() {
  if (!fs.existsSync(FILE)) return [];
  return fs
    .readFileSync(FILE, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim().length)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export function deleteMessage(id) {
  const before = readMessages();
  const remaining = before.filter((m) => m.id !== id);
  if (remaining.length === before.length) return false;
  fs.writeFileSync(FILE, remaining.map((m) => JSON.stringify(m)).join('\n') + (remaining.length ? '\n' : ''), { mode: 0o600 });
  return true;
}
