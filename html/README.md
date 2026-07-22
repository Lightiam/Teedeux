# Teedeux HTML5

Production-oriented **HTML5 progressive web app** for Teedeux — optimized for mobile and desktop browsers.

## Features

- Semantic HTML5 + mobile-first CSS (safe areas, tap targets, reduced motion)
- Hash-routed SPA: auth, home, stores, hybrid cart/checkout, tracking, shopper pick
- Dual fulfillment UI (local same-day vs nationwide shipped)
- `localStorage` cart/auth/orders persistence
- Installable PWA (`manifest.webmanifest` + service worker)
- Teedeux Vitality design tokens (Hanken Grotesk / JetBrains Mono)

## Run locally

```bash
cd html
python3 -m http.server 8080
# open http://localhost:8080
```

Or any static host (Netlify, Cloudflare Pages, S3, nginx).

## Demo

| Role | Email | Password |
|------|-------|----------|
| Customer | `ada@teedeux.com` | any 4+ chars |
| Shopper | `shopper@teedeux.com` | any 4+ chars |

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
  icons/icon.svg
```
