# ChatNex

> Self-hosted embeddable AI chatbot for websites, portfolios, documentation, SaaS products, and online services.

ChatNex is a production-minded chatbot platform built with Next.js, TypeScript, React, Tailwind CSS, Prisma, SQLite, and Zod. It provides a lightweight website widget, anonymous visitor sessions, configurable AI providers, local knowledge retrieval, FAQs, analytics, and a protected admin console.

## Highlights

- Embeddable JavaScript widget — no React required on the host website
- Local demo mode — works without an external AI API key
- OpenAI-compatible provider abstraction
- Website-specific knowledge base with weighted keyword retrieval
- FAQ matching
- Anonymous visitor/session management
- Optional conversation persistence
- Admin authentication with hashed passwords and signed HttpOnly sessions
- Widget appearance, welcome message, quick actions, and system prompt settings
- Conversation viewer and deletion
- Analytics events and knowledge-match tracking
- Public widget configuration that never exposes the system prompt or server secrets
- Zod validation and public chat rate limiting
- Mobile-responsive, keyboard-friendly interface
- SQLite + Prisma for simple local/self-hosted deployments

## Stack

Next.js 15 · TypeScript · React 19 · Tailwind CSS 4 · Prisma 6 · SQLite · Zod · JOSE · bcryptjs · Vitest

## Requirements

- Node.js 20.9+
- npm

## Installation

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

The demo widget is available on the home page. The admin console is at `/admin`.

## Demo Mode

ChatNex automatically uses the local mock provider when `AI_API_KEY` is empty. This lets you test the widget, sessions, knowledge retrieval, FAQs, persistence, and admin dashboard without an external AI service.

## Admin

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CHATNEX_SESSION_SECRET` in `.env`. The first successful login creates the configured admin account if it does not already exist.

Use a strong random password and a unique session secret in production.

## AI Provider

The provider contract is defined in `lib/ai/provider.ts`. The included OpenAI-compatible implementation reads its credentials only on the server:

```env
AI_API_KEY="..."
AI_MODEL="gpt-4o-mini"
AI_API_URL="https://api.openai.com/v1/chat/completions"
```

The browser never receives `AI_API_KEY` or the server environment.

## Embedding

Add one script to another website:

```html
<script
  src="https://your-chatnex-domain.example/chatnex.js"
  data-chatnex-id="demo">
</script>
```

For local development:

```html
<script src="http://localhost:3000/chatnex.js" data-chatnex-id="demo"></script>
```

The loader creates an iframe, so the host website does not need React, Next.js, or ChatNex dependencies. The iframe is served from the ChatNex origin and keeps the host page isolated from the widget UI.

Use HTTPS in production.

## API

Public:

- `POST /api/chat` — send a visitor message
- `GET /api/widget?id=demo` — retrieve safe public widget configuration
- `GET /api/health` — application/database health check

Admin-authenticated:

- `POST /api/auth` — login/logout
- `GET /api/analytics`
- `GET/DELETE /api/conversations`
- `GET/POST/PUT/DELETE /api/knowledge`
- `GET/POST/PUT/DELETE /api/faqs`
- `GET/PUT /api/settings`
- `PUT /api/widget`

All mutation inputs are validated server-side.

## Knowledge Retrieval

ChatNex intentionally uses a simple local retrieval engine instead of requiring a vector database. It normalizes text and scores title, category, content, and keywords. The retrieval boundary is isolated in `lib/knowledge/search.ts`, making a future semantic/vector implementation straightforward.

## Privacy

Visitors do not need accounts. ChatNex does not intentionally store IP addresses. Conversation persistence can be disabled from the admin settings; when disabled, the API does not create a database conversation or message record.

Website operators remain responsible for privacy notices, consent, retention policies, AI provider terms, and applicable data protection laws. ChatNex does not claim automatic GDPR compliance.

## Security

The project includes:

- server-side environment secrets
- hashed admin passwords
- signed HttpOnly admin sessions
- strict request validation
- public chat rate limiting
- message length limits
- safe public widget configuration
- no arbitrary HTML rendering in chat messages
- security response headers
- widget/conversation ownership checks
- generic public error messages

The in-memory rate limiter is intentionally simple and suitable for local/single-instance deployments. Use a shared limiter such as Redis for horizontally scaled production deployments.

## Testing

```bash
npm run typecheck
npm test
```

## Production checklist

1. Use HTTPS.
2. Replace the example admin password.
3. Generate a random `CHATNEX_SESSION_SECRET` of at least 32 characters.
4. Keep `AI_API_KEY` server-side.
5. Review conversation retention and privacy requirements.
6. Replace SQLite with a production database if your deployment requires concurrent/high-volume workloads.
7. Use a distributed rate limiter when running multiple instances.
8. Review the AI provider's data-processing terms.

## Disclaimer

ChatNex is provided as a software project. Operators are responsible for configuring it securely and complying with applicable laws, privacy requirements, retention policies, and third-party AI provider terms.
