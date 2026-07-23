# Teedeux HTML5

Production-oriented **HTML5 progressive web app** for Teedeux — optimized for mobile and desktop browsers.

## Deploy on Netlify (recommended)

1. Push this repo to GitHub (already done).
2. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project**.
3. Select the Teedeux repo. Netlify reads root [`netlify.toml`](../netlify.toml):
   - **Publish directory:** `html`
   - **Build command:** none (static)
4. Click **Deploy site**.

CLI alternative:

```bash
# from repo root
npx netlify-cli deploy --prod --dir=html
```

After deploy, open the Netlify URL (e.g. `https://your-site.netlify.app`). The PWA installs from the browser; hash routes work offline via the service worker.

## Run locally

```bash
cd html
python3 -m http.server 8080
# open http://localhost:8080
```

## Super Admin · Products

Site owner product editor:

- Open **`/admin.html`**
- Or tap the orange **Admin** chip / Profile → **Super Admin · Products**
- Login: `teedeux.dev@gmail.com` / `ChangeMeImmediately123!`
- Create, edit, delete products; export/import JSON; reset defaults
- Changes save in the browser and update the shop catalog immediately

## Demo

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `teedeux.dev@gmail.com` | `ChangeMeImmediately123!` |
| Customer | `ada@teedeux.com` | any 4+ chars |
| Shopper | `shopper@teedeux.com` | any 4+ chars |

## Features

- Semantic HTML5 + mobile-first CSS (safe areas, tap targets, reduced motion)
- Hash-routed SPA: home, aisles, listing, cart, checkout, orders, tracking, favorites
- Dual fulfillment UI (local same-day vs nationwide shipped)
- `localStorage` cart/auth/orders + admin product overrides
- Installable PWA (`manifest.webmanifest` + service worker)
- Environment monitor at `/monitor.html`
- Super Admin product CMS at `/admin.html`

## Structure

```
html/
  index.html              App shell
  admin.html              Super Admin product manager
  monitor.html            Environment monitor
  css/styles.css          Design system + layouts
  css/admin.css           Admin console styles
  js/catalog.js           African food catalog + product CRUD
  js/backend.js           Commerce backend (localStorage)
  js/store.js             Helpers
  js/app.js               Router + views
  js/admin.js             Super Admin UI logic
  manifest.webmanifest
  sw.js
  _redirects / _headers   Netlify SPA + caching
  icons/icon.svg
```
