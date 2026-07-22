# Teedeux Mobile

Production Expo (React Native) app for **Teedeux** — African groceries with dual fulfillment:

- **Local same-day** shopper delivery for fresh / frozen
- **Nationwide shipping** for dry specialty goods

Built against the Teedeux Vitality design system (`stitch_teedeux_mart_delivery_app/teedeux_vitality`).

## Run

```bash
cd mobile
npm install
npx expo start
```

- Press `w` for web, scan QR with Expo Go for device
- iOS simulator: `npx expo start --ios` (macOS)
- Android emulator: `npx expo start --android`

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | `ada@teedeux.com` | any 4+ chars |
| Shopper | `shopper@teedeux.com` | any 4+ chars |

## App map

| Flow | Routes |
|------|--------|
| Splash / gate | `/` |
| Onboarding + auth | `/(auth)/onboarding`, `login`, `signup`, `forgot-password` |
| Browse & cart | `/(tabs)`, `/store/[id]`, `/(tabs)/cart` |
| Checkout | `/address`, `/payment`, `/checkout`, `/order-confirmation` |
| Tracking | `/order/[id]`, `/(tabs)/orders` |
| Shopper | `/shopper`, `/shopper/order/[id]` |

## Production builds (EAS)

```bash
npm i -g eas-cli
eas login
# Set real projectId in app.json extra.eas.projectId
eas build --platform all --profile production
eas submit --platform all
```

## Architecture

- **Expo Router** file-based navigation
- **Zustand** + AsyncStorage — auth, cart, orders, session
- **Catalog seed** — 4 US stores, 30+ African grocery SKUs, recipe bundles
- Hybrid cart auto-routes items by `temperatureClass` / `shippable` / `localAvailable`
- Stripe Connect / Shippo hooks documented for backend wiring (`web/` Prisma schema)

## Typecheck

```bash
npx tsc --noEmit
```
