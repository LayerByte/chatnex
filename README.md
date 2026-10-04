# ChatNex

Modern, self-hostable and embeddable website chatbot platform built with Next.js, TypeScript, React, Tailwind CSS, Prisma and SQLite.

## Overview
ChatNex provides a floating chatbot widget, anonymous visitor sessions, configurable AI providers, local keyword retrieval, FAQs, admin authentication, analytics and a lightweight embed script.

## Features
- Floating responsive chat widget
- Demo/mock AI mode with no API key
- OpenAI-compatible provider abstraction
- Website knowledge base and FAQ retrieval
- Anonymous visitor sessions
- Conversation storage toggle
- Admin dashboard and protected APIs
- Analytics events
- Zod input validation
- Basic in-memory rate limiting
- Accessible keyboard-first controls
- Light/dark-ready appearance configuration

## Architecture
`components/chat` contains public UI. `app/api` contains server endpoints. `lib/ai` isolates AI providers, `lib/knowledge` handles retrieval, Prisma owns persistence, and `lib/auth` protects administration.

## Installation
Requirements: Node.js 20.9+.

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables
See `.env.example`. Never expose `AI_API_KEY`, database credentials or server secrets to browser code.

## Demo Mode
If `AI_API_KEY` is empty, ChatNex automatically uses the local mock provider. Seed the demo data with:

```bash
npx prisma db seed
```

Default admin credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. Change them before deployment.

## AI Provider
The provider interface lives in `lib/ai/provider.ts`. The included provider uses an OpenAI-compatible `/chat/completions` endpoint. Replace or extend `lib/ai` without coupling the widget to a vendor.

## Knowledge Base and FAQ
Knowledge entries use title, category, content, keywords and enabled state. Retrieval is intentionally simple: normalized keyword, title and category scoring. This keeps local development lightweight while leaving a clean boundary for future semantic search.

## Embedding ChatNex
For a deployed instance:

```html
<script src="https://example.com/chatnex.js" data-chatnex-id="demo"></script>
```

For local testing:

```html
<script src="http://localhost:3000/chatnex.js" data-chatnex-id="demo"></script>
```

Production deployments should use HTTPS. The embed script creates a lightweight iframe and does not require React on the host website.

## API
- `POST /api/chat`
- `POST/GET/PUT/DELETE /api/conversations`
- `GET/POST/PUT/DELETE /api/knowledge`
- `GET/POST/PUT/DELETE /api/faqs`
- `GET /api/analytics`
- `GET/PUT /api/settings`
- `POST /api/auth`

Admin endpoints require the HttpOnly admin session cookie.

## Admin Dashboard
Visit `/admin`. The dashboard exposes overview metrics and knowledge/FAQ views. The API is intentionally modular so additional editor screens can be added without changing the public widget.

## Security
All public chat messages are validated and limited to 4000 characters. Basic per-visitor rate limiting returns HTTP 429. Admin APIs require a signed session cookie. Passwords are hashed with bcrypt. AI keys remain server-side. User input is treated as untrusted context and is never allowed to rewrite the configured system instructions.

## Privacy
ChatNex does not require visitor accounts and does not intentionally store IP addresses. Website operators can disable conversation persistence. Operators remain responsible for their privacy policy, retention, consent requirements, AI provider terms and applicable data protection laws. ChatNex does not claim automatic GDPR compliance.

## Testing
```bash
npm test
```

The included tests cover knowledge ranking and input validation. The API design keeps the remaining integration surfaces isolated for extension.

## Deployment
Build with `npm run build` and serve with `npm start`. Use HTTPS, a strong `CHATNEX_SESSION_SECRET`, a production database strategy, strong admin credentials, and an appropriate AI provider configuration. SQLite is intended for local/self-hosted starter deployments; use a production-grade database when your workload requires it.

## Disclaimer
ChatNex is a software project. Website owners are responsible for security, privacy, consent, data retention, AI provider usage and applicable laws.
