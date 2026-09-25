# Logsh

**From blind spots to full visibility across your apps.**

Logsh is a real-time event tracking and alerting platform. Send events from any app or service with a simple API call, organize them into workspaces, and watch them show up live on your dashboard — with optional push notifications when something needs your attention.

🔗 [logsh.co](https://logsh.co) · [Discord](https://discord.gg/DeDxTANd) · [@Jeanpacara](https://x.com/Jeanpacara)

## Features

- **Event API** — a single authenticated `POST /api/event` endpoint to send events from anywhere (server, CI, cron jobs, webhooks, etc.)
- **Workspaces** — group related events; workspaces are created automatically the first time you send an event to a new one
- **Live feed (SSE)** — events stream to the dashboard in real time via Server-Sent Events
- **Push notifications** — opt-in web push per event so you get notified the moment something happens
- **API keys** — generate and manage per-user API keys to authenticate requests
- **Auth** — sign in with Google, GitHub, or a passwordless magic link (via [Better Auth](https://www.better-auth.com/))
- **Billing** — subscriptions and plans powered by Stripe
- **Rate limiting** — Redis-backed rate limiting on the event API, with support for allow-listed unlimited accounts
- **Docs** — built-in `/docs` section with getting-started guide and API reference

## Tech stack

| Layer          | Choice                                   |
| -------------- | ----------------------------------------- |
| Framework      | [Next.js](https://nextjs.org/) 16 (App Router) + React 19 |
| Language       | TypeScript                                |
| UI             | Tailwind CSS + Radix UI / shadcn          |
| Auth           | Better Auth (Google, GitHub, magic link)  |
| Database       | PostgreSQL + Drizzle ORM                  |
| Cache / pub-sub / rate limiting | Redis (ioredis)          |
| Payments       | Stripe                                    |
| Email          | Resend + React Email                      |
| Push notifications | Web Push (VAPID)                      |
| Validation     | Zod                                       |
| State          | Zustand                                   |

## Getting started

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io/)
- A PostgreSQL database
- A Redis instance

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy `.example.env` to `.env` and fill in the values:

```bash
cp .example.env .env
```

You'll need credentials for:

- **Better Auth** — `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- **OAuth providers** — `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- **Stripe** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Database** — `DATABASE_URL` (PostgreSQL connection string)
- **Redis** — `REDIS_URL`, `REDIS_TLS`
- **Resend** — `RESEND_API_KEY`
- **Web Push** — `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
- **Cron** — `CRON_SECRET`

> Regenerate `BETTER_AUTH_SECRET` and any other secrets before deploying — never reuse the placeholder values from `.example.env`.

### 3. Set up the database

```bash
pnpm run dev:drizzle:push
```

### 4. Run the app

```bash
pnpm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (with HTTPS: `pnpm dev:https`) |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm dev:email` | Preview email templates locally |
| `pnpm dev:drizzle:studio` | Open Drizzle Studio |
| `pnpm dev:drizzle:generate` | Generate a new migration from schema changes |
| `pnpm dev:drizzle:push` | Push the schema to the database |
| `pnpm dev:better-auth:schema:generate` | Regenerate the Better Auth database schema |

## Sending your first event

```js
await fetch('https://logsh.co/api/event', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_API_KEY>',
  },
  body: JSON.stringify({
    workspace: 'logsh',
    event: 'user.signup',
    description: 'User signed up for the newsletter.',
    icon: '👤',
    notify: false,
    metadata: { user_id: '12345', plan: 'pro' },
  }),
});
```

See the full [getting started guide](https://logsh.co/docs/get-started) and [API reference](https://logsh.co/docs/api-reference) for details.

## License

MIT © [Jean Pablo](https://x.com/Jeanpacara) — see [LICENSE](./LICENSE) for details.
