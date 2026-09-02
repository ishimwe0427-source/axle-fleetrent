# FleetRent — White-label machinery rental platform

Production-ready Next.js product for earthmoving / construction equipment rental companies. Ship once, rebrand per client from the **super admin** panel.

The public internet preview is **hidden** until you publish it from **Admin → Go live**.

## Product features

- Public marketing site + growing fleet catalog (negotiated quotes, no public fixed prices)
- Client accounts, booking requests, availability sync (unavailable machines show as on hire)
- Automatic official confirmation emails when a client books
- Admin: slides, galleries, fleet, content, rental approvals, official email
- **Super admin white-label**: logo, favicon, logo size, colors, company names, nav tabs, section toggles, support contacts
- **Support chat** with a growing message archive (customer + staff inbox)
- Role model: `superadmin` · `admin` · `customer`

## Quick start

```bash
cp .env.example .env.local
npm install
npm run db:reset
npm run dev
```

Open http://localhost:3047

Production:

```bash
npm run build
npm start
```

## Make it live on the internet

1. Sign in as super admin.
2. Open **Admin → Go live**.
3. Click **Make website live**.
4. On Vercel: [axle-fleetrent dashboard](https://vercel.com/ishimwe0427-1380s-projects/axle-fleetrent) → **Settings → Environment Variables** → set `SITE_PUBLISHED=true` → **Deployments → Redeploy**.

GitHub: https://github.com/ishimwe0427-source/axle-fleetrent

## Owner login (super admin)

Set in `.env.local` **before** first seed / `db:reset`:

| Variable | Purpose |
|----------|---------|
| `SUPERADMIN_EMAIL` | Owner login email |
| `SUPERADMIN_PASSWORD` | Owner password (change immediately) |
| `AUTH_SECRET` | JWT secret (required in production) |
| `SITE_PUBLISHED` | `true` to show the public site, `false` to hide it |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Official booking emails (or configure in Admin → Official email) |

Defaults if unset: `owner@fleetrent.pro` / `ChangeMeNow!2026`

There are **no demo accounts** on the login page.

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Homepage |
| `/fleet` | Catalog |
| `/rent` | Booking (login required) |
| `/chat` | Customer support archive |
| `/login` `/register` | Auth |
| `/dashboard` | Client rentals |
| `/admin` | Staff control center |
| `/admin/go-live` | Hide or publish the public website |
| `/admin/email` | Official booking confirmation emails |
| `/admin/branding` | Super admin: white-label look |
| `/admin/users` | Super admin: roles |
| `/admin/chat` | Staff chat inbox |
| `/admin/fleet` `/admin/content` `/admin/rentals` | Operations |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Jose · bcryptjs · Zod · Nodemailer

Data: `data/db.json` · uploads: `public/uploads/`

Legacy static HTML lives in `_legacy/`.
