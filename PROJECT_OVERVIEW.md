# Project Overview — Agro-Sathi (Smart-Agriculture)

This file summarizes the repository, backend services, public API endpoints, third-party integrations, environment variables, and useful developer commands.

## Quick summary
- Name: Agro-Sathi / Smart-Agriculture
- Stack: Node.js + Express backend, React (Vite) frontend, Supabase as primary DB, Redis/Bull for queues, Twilio for notifications, Sarvam.ai for AI chat/voice, OpenWeather (optional) for weather, scheduled jobs for market prices.

## Where to look
- Backend entry: `backend/src/server.js` and `backend/src/app.js`
- Backend routes: `backend/src/routes/*` (mounted under `/api/v1`)
- Backend controllers: `backend/src/controllers/*`
- Backend services (business logic / 3rd-party wrappers): `backend/src/services/*`
- Jobs / cron: `backend/scripts/*` and `backend/src/jobs/*`
- Frontend: `frontend/src` (Vite + React + Tailwind)
- Example environment variables: `backend/.env.example`

## Notable backend controllers (key features)
- `admin.controller.js` — admin APIs
- `ai.controller.js` — AI chat and voice endpoints
- `alert.controller.js` — price alert creation/management
- `auth.controller.js` — register / login
- `crop.controller.js` — crop-related endpoints
- `cropTrade.controller.js` — creating/reading crop trades
- `forum.controller.js` — forum posts and comments
- `market.controller.js` — market price queries
- `notification.controller.js` — send notifications, alerts history
- `profit-calculator.controller.js` — profit calculator endpoints
- `schemes.controller.js` — government schemes data
- `search.controller.js` — search endpoints (commodities, markets, schemes)
- `shipment.controller.js` — shipment creation, tracking, updates
- `user.controller.js` — user profile and preferences
- `weather.controller.js` — current weather and forecast

## Backend services (internal + 3rd-party wrappers)
- `alert.service.js`
- `ai.service.js` — Sarvam.ai integration (chat, STT, TTS)
- `auth.service.js`
- `cropTrade.service.js`
- `forum.service.js`
- `market.service.js` — Supabase-backed market price queries
- `notification.service.js` — Twilio + Bull + Redis-based notifications + alert checker
- `whatsapp.service.js` — Twilio WhatsApp wrapper
- `weather.service.js` — OpenWeather integration with mock fallback
- `user.service.js`
- `shipment.service.js`
- `search.service.js`
- `schemes.service.js`
- `profit-calculator.service.js`

## Main API routes (mounted under `/api/v1`)
Note: these route files live in `backend/src/routes` and are mounted in `backend/src/app.js`.

- `/api/v1/auth`
  - `POST /register` — create user
  - `POST /login` — login

- `/api/v1/market`
  - `GET /latest` — latest market prices (filters supported)
  - `GET /history` — price history
  - `GET /trends` — aggregated trends

- `/api/v1/weather`
  - `GET /current` — current weather (lat, lon)
  - `GET /forecast` — 5-day forecast

- `/api/v1/ai`
  - `POST /chat` — authenticated chat with AI (Sarvam)
  - `POST /voice` — authenticated voice assistant (STT -> chat -> TTS)

- `/api/v1/notifications`
  - `POST /sms` — send SMS
  - `POST /whatsapp` — send WhatsApp messages
  - `POST /email` — send email (placeholder)
  - `POST /price-alert` — create price alert (authenticated)
  - `POST /scheme-notification` — notify users about schemes
  - `GET /history` — get notification history

- `/api/v1/shipments` (auth required)
  - `POST /` — create shipment
  - `GET /` — list shipments
  - `GET /:shipmentId` — shipment details
  - `GET /:shipmentId/history` — tracking history
  - `PATCH /:shipmentId/status` — update status
  - `PATCH /:shipmentId/location` — update GPS location
  - `DELETE /:shipmentId` — delete

- `/api/v1/search`
  - `GET /global`, `/schemes`, `/commodities`, `/markets`, `/suggestions`, `/trending`

- Other mounted route groups (see `backend/src/routes`): `forum`, `schemes`, `alerts`, `crop`, `crop-trade`, `admin`, `profit-calculator`, `user`

## Background jobs & scheduled tasks
- `backend/scripts/fetchMarketPrices.js` — cron job (*/30 * * * *) to fetch market prices from the Government API (`api.data.gov.in` resource used) and insert into Supabase.
- `backend/src/jobs/priceMonitor.js` — runs every minute to evaluate price alerts and notify users (WhatsApp/Twilio). In demo mode it simulates prices.
- `backend/scripts/fetchGovtSchemes.js` — seeds government schemes into Supabase (static seed list).

## External APIs and third-party integrations
- Supabase (`@supabase/supabase-js`) — primary datastore for app tables (market_prices, price_alerts, users, schemes, shipments, etc.)
- Government market prices API: https://api.data.gov.in/resource/... used in `fetchMarketPrices.js`
- Sarvam.ai — AI provider for chat completions, speech-to-text, and text-to-speech (`SARVAM_API_KEY`, used in `ai.service.js`)
- OpenWeather (`OPENWEATHER_API_KEY`) — current weather & forecast (optional, `weather.service.js` falls back to mock data)
- Twilio — SMS / WhatsApp notifications (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `TWILIO_SMS_NUMBER`)
- Redis + Bull — background job queue for notifications (`REDIS_URL`) and `bull` dependency
- RSS feeds (`rss-parser`) — used for news/feeds (check `verify_news.js` / `src/services`)
- Google Maps (frontend) via `@react-google-maps/api` for mapping/location features in the UI

## Environment variables (see `backend/.env.example`)
- `NODE_ENV`, `PORT`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `REDIS_URL`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `TWILIO_SMS_NUMBER`
- `SARVAM_API_KEY`
- `OPENWEATHER_API_KEY`

Important: do NOT commit real secrets to git. The repository may contain an example `.env` and other sample files.

## How to run (local)
1. Backend
   - cd backend
   - install: `npm install`
   - copy `.env.example` -> `.env` and fill credentials (Supabase, Twilio, Sarvam, OpenWeather as needed)
   - run dev: `npm run dev` (uses `nodemon src/server.js`) or `npm start` for production

2. Frontend
   - cd frontend
   - install: `npm install`
   - run dev: `npm run dev`

3. Optional: `docker-compose.yml` exists at repo root for containerized setup (inspect to see included services)

## Files that define DB schemas or seeds
- `backend/supabase_price_alerts_table.sql`
- `backend/supabase_shipments_table.sql`
- `backend/supabase_crop_trades_table.sql`
- Seeder: `backend/scripts/fetchGovtSchemes.js`

## Final: consolidated list of all services and external APIs used
Internal service files (business logic):
- alert.service, ai.service, auth.service, cropTrade.service, forum.service, market.service, notification.service, whatsapp.service, weather.service, user.service, shipment.service, search.service, schemes.service, profit-calculator.service

Third-party APIs / external services:
- Supabase (database)
- Government Market API (api.data.gov.in resource used by `fetchMarketPrices.js`)
- Sarvam.ai (AI: chat/stt/tts)
- OpenWeather (weather)
- Twilio (SMS & WhatsApp)
- Redis (Bull queues)
- RSS feeds (rss-parser)
- Google Maps (frontend)

---

If you want, I can:
- Open-source a single CLI summary (JSON) of all endpoints and env vars
- Generate an OpenAPI (Swagger) spec from the route files
- Run the app locally and demonstrate a few endpoints

Tell me which of these you'd like next.
