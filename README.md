# Nholyn Grace — Creative Portfolio & Lookbook

A professional creative portfolio with a 22-look page-flip lookbook, secure backend, and the
Nholyn Palette as the design system. Domain: **nholyngrace.com**.

## Stack

| Layer    | Tech                                                       |
| -------- | ---------------------------------------------------------- |
| Frontend | React 19 + Vite + [Motion](https://motion.dev) (animations) |
| Backend  | Node.js + Express                                          |
| Security | Helmet, CORS, rate limiting, input validation, JWT admin, AES-256-GCM encryption at rest |

## Quick start

```bash
# 1. Backend (port 4000)
cd server
npm install
npm start          # or: npm run dev (auto-restart)

# 2. Frontend dev (port 5173, proxies /api to :4000)
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Production

```bash
cd client
npm run build      # outputs client/dist
cd ../server
npm start          # serves the built site + API on :4000
```

Open http://localhost:4000

## Admin inbox (read encrypted messages)

Visit `http://localhost:5173/#/inbox` (dev) or `http://localhost:4000/#/inbox` (prod).

- On first backend boot, credentials are generated and written to
  `server/keys/admin-credentials.txt` (and printed in the console).
- Sign in → view decrypted messages → delete.
- `DELETE server/keys/admin-credentials.txt` after saving the password somewhere safe.

## Security design

- **Encryption at rest** — every contact message is encrypted with **AES-256-GCM**
  (`aes-256-gcm`, 12-byte IV + auth tag) using a random key auto-generated into
  `server/.env` (`ENCRYPTION_KEY`). The raw message never touches the disk.
- **Rate limiting** — strict per-IP limits on contact (10 / 15 min) and login (8 / 15 min).
- **Validation** — all input validated + sanitized with `express-validator`; JSON body capped
  at 32 kB.
- **Honeypot** — invisible `website` field catches bots silently.
- **Headers** — `helmet` sets `X-Content-Type-Options`, `X-Frame-Options`, CSP, etc.
- **Admin auth** — bcrypt password hash + short-lived JWT in an `httpOnly` cookie (Secure in
  prod); login is rate-limited and the admin API is unguessable without the token.
- **No secrets in code** — secrets live in `server/.env` / `server/keys/`, both gitignored.
  `.env.example` shows the shape only.

## Layout

- `/lookbook/*` — the 22 numbered looks, compressed to ~130 KB each (from ~70 MB source ZIP)
- `/projects/*` — brand, editorial, and magazine-cover work
- `/portraits/*` — studio portraits
- `manifest.json` — image manifest the UI loads at runtime

## Nholyn Palette

| Token       | Hex       |
| ----------- | --------- |
| Wine        | `#530F0E` |
| Cream       | `#F8E8D8` |
| Blush       | `#F3A0AA` |
| Cocoa       | `#31160F` |
| Rosewood    | `#601C27` |
| Deep Maroon | `#1F0005` |

## Project structure

```
nholyn-portfolio/
├── client/            # React + Vite + Motion frontend
│   ├── public/        # images + manifest.json
│   └── src/           # components + styles
├── server/            # Express API
│   ├── src/           # index.js, env.js, security.js, store.js
│   ├── data/          # encrypted messages (JSONL) — gitignored
│   └── keys/          # admin credentials — gitignored
└── tools/             # process-images.ps1 (source→web compression)
```
