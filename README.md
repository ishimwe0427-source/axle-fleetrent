# FleetRent — White-label machinery rental platform

Production-ready Next.js product for earthmoving / construction equipment rental companies. Ship once, rebrand per client from the **super admin** panel.

## Product features

- Public marketing site + growing fleet catalog (negotiated quotes, no public fixed prices)
- Client accounts, booking requests, availability sync
- Admin: slides, galleries, fleet, content, rental approvals
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

## Owner login (super admin)

Set in `.env.local` **before** first seed / `db:reset`:

| Variable | Purpose |
|----------|---------|
| `SUPERADMIN_EMAIL` | Owner login email |
| `SUPERADMIN_PASSWORD` | Owner password (change immediately) |
| `AUTH_SECRET` | JWT secret (required in production) |

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
| `/admin/branding` | Super admin: white-label look |
| `/admin/users` | Super admin: roles |
| `/admin/chat` | Staff chat inbox |
| `/admin/fleet` `/admin/content` `/admin/rentals` | Operations |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Jose · bcryptjs · Zod

Data: `data/db.json` · uploads: `public/uploads/`

Legacy static HTML lives in `_legacy/`.
