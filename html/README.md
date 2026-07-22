# Teedeux Storefront

Full African grocery marketplace UI **rebranded from [AfroConnect](https://github.com/Lightiam/AfroConnect)**.

Product catalog, store listings, cart, checkout, accounts, and vendor pages are the original AfroConnect content with Teedeux branding.

## Run locally

```bash
cd html
npm install   # optional — only needed for Capacitor/express
npx serve -p 8080
# or: python3 -m http.server 8080
```

Open `http://localhost:8080/index.html`.

## Deploy (Netlify)

Repo root `netlify.toml` publishes this `html/` folder (multi-page static site).

## Branding

- App name: **Teedeux**
- Logo: `img/logo/teedeux_logo.svg`
- Theme: Teedeux burnt orange (`#9c3f00`)
- Product names keep African grocery SKUs (e.g. *Teedeux Nigerian Plantain Chips*, *Teedeux Pure Palm Oil*)
