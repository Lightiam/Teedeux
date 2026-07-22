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

## Demo

| Role | Email | Password |
|------|-------|----------|
| Customer | `ada@teedeux.com` | any 4+ chars |
| Shopper | `shopper@teedeux.com` | any 4+ chars |

## Features

- Semantic HTML5 + mobile-first CSS (safe areas, tap targets, reduced motion)
- Hash-routed SPA: auth, home, stores, hybrid cart/checkout, tracking, shopper pick
- Dual fulfillment UI (local same-day vs nationwide shipped)
- `localStorage` cart/auth/orders persistence
- Installable PWA (`manifest.webmanifest` + service worker)
- Teedeux Vitality design tokens (Hanken Grotesk / JetBrains Mono)

## Structure

```
html/
  index.html              App shell
  css/styles.css          Design system + layouts
  js/catalog.js           Stores, products, bundles
  js/store.js             State + localStorage
  js/app.js               Router + views
  manifest.webmanifest
  sw.js
  _redirects / _headers   Netlify SPA + caching
  icons/icon.svg
```
