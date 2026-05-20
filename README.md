# Smart Agriculture Platform

A comprehensive, multilingual platform designed to empower farmers with real-time market data, AI-driven insights, weather forecasts, crop tracking, and a community forum. 

---

## 🌟 Features & Functionalities

- **Real-Time Market Prices**: Live tracking of crop prices across various markets with trends and analytics.
- **AI-Powered Chat Assistant**: Multilingual AI assistant using Sarvam API for voice and text chat support, specifically tuned for agricultural inquiries.
- **Weather Forecasts**: Accurate, location-based weather updates to help farmers plan their activities.
- **Government Schemes**: A directory of accessible government agricultural schemes and subsidies.
- **Crop Calendar & Tracking**: Manage crop cycles, tracking planting, growing, and harvesting stages.
- **Profit Calculator**: Tools to estimate crop profitability based on yield, market price, and input costs.
- **Plant Disease Detection**: Upload a plant or leaf image and run the trained disease classifier from the app.
- **Community Forum**: A discussion board for farmers and experts to share knowledge and ask questions.
- **Multilingual Support**: Dynamic translation across the app for accessibility in various regional languages.
- **Dynamic Theming**: Support for Light, Dark, and a customized "Green" nature-inspired theme.

---

## 🏗️ Internal Architecture & Workings

The project follows a standard decoupled **MERN stack** architecture (MongoDB, Express.js, React, Node.js).

### Frontend (React + Vite)
- **Framework**: Built with React and bundled via Vite for extremely fast HMR and optimized builds.
- **Styling**: TailwindCSS is used for utility-first styling with custom themes.
- **State Management & Data Fetching**: Standard React Hooks (useState, useEffect) are used along with Axios for API interactions.
- **Internationalization**: `i18next` handles multilingual translations dynamically.
- **Routing**: `react-router-dom` manages client-side routing.

### Backend (Node.js + Express)
- **API Architecture**: RESTful API structure with dedicated controllers, services, and route handlers.
- **Database Wrapper**: A custom wrapper (`mongoDatabase.js`) translates the previously used Supabase queries into native MongoDB operations (`MongoClient`), ensuring seamless backward compatibility without changing controller logic.
- **Background Jobs**: Node-cron/Bull jobs manage background tasks like fetching real-time market prices or dispatching alerts.
- **Authentication**: JWT-based authentication via `/api/v1/auth`.

---

## 🔌 APIs Used

1. **Sarvam AI API**: Powers the multilingual, voice-capable AI chatbot tailored for farmers.
2. **OpenWeather API**: Fetches current weather data and forecasts based on the user's geolocation.
3. **Twilio API**: Handles SMS and WhatsApp notifications for critical alerts (simulated in development if credentials are not provided).
4. **Google Maps API**: Renders maps for the "Markets" section, helping farmers find nearby locations.

---

## 🛣️ Routes Map

### Backend Routes (`/api/v1/...`)
- `/auth`: Registration, login, token refresh, and user sessions.
- `/user` & `/users`: User profile management and preferences.
- `/market`: Fetch market prices, history, and trends.
- `/ai`: Handle prompts for the AI Chatbot via Sarvam AI.
- `/weather`: Proxy endpoints for OpenWeather API.
- `/crop`: Crop calendar and personal inventory management.
- `/crop-trade`: Buying/selling listings for crops.
- `/schemes`: Access government schemes data.
- `/alerts`: System alerts and Twilio notifications.
- `/forum`: Community posts, comments, and upvotes.
- `/profit-calculator`: Endpoints supporting crop profitability logic.
- `/ml`: Plant disease model health checks and prediction endpoints.
- `/shipments`: Logistics tracking.
- `/admin`: Dashboard metrics and admin management.
- `/search`: Global search indexing across the app.

### Frontend Routes
- `/`: Dashboard (Home)
- `/login`, `/register`: Authentication pages
- `/market`: Market trends & price analysis
- `/weather`: Localized weather forecast
- `/schemes`: Government agricultural schemes
- `/crop-calendar`: Tracking the growth of planted crops
- `/profit-calculator`: Profit estimation tools
- `/forum`: Community discussion boards
- `/profile`: User settings and language/theme preferences

---

## 🚀 Setup & Installation Steps

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Local or Atlas)
- API Keys for Sarvam, OpenWeather, and Google Maps

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install ML dependencies
cd ..
python -m pip install -r "Plant disease dettection/requirements.txt"
```

### 2. Environment Variables (.env)

**Backend `.env`** (create in `backend/.env`):
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017

# External APIs
SARVAM_API_KEY=your_sarvam_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_SMS_NUMBER=your_twilio_number
```

**Frontend `.env`** (create in `frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 3. Database Configuration

The project uses MongoDB. By default, it connects to `mongodb://localhost:27017/smart_agri`.
- Ensure your MongoDB server is running locally.
- On the first successful startup, the backend will auto-seed essential mock data (like initial `market_prices` and `schemes`) into the database if the collections are empty. This logic is handled in `backend/src/config/mongoDatabase.js`.

### 4. Train the Plant Disease Model

The dataset archive should remain inside `Plant disease dettection`. After extraction, the training script can use the prepared dataset structure in the workspace.

```bash
python "Plant disease dettection/train_model.py"
```

This generates:
- `Plant disease dettection/trained_plant_disease_model.keras`
- `Plant disease dettection/model_metadata.json`
- `Plant disease dettection/training_history_runtime.json`

### 5. Running the Project

**Recommended Windows startup for the complete app:**
```bash
powershell -ExecutionPolicy Bypass -File .\start-smart-agri.ps1 -RebuildFrontend
```

This starts:
- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:5000/api/v1`
- ML service: `http://127.0.0.1:8008`

To stop everything:
```bash
powershell -ExecutionPolicy Bypass -File .\stop-smart-agri.ps1
```

**Manual development mode:**
```bash
cd backend
npm run dev
```

---

## 📝 Sample API Request & Response

**Endpoint:** `GET /api/v1/market/prices?crop=wheat`

**Request:**
```http
GET /api/v1/market/prices?crop=wheat HTTP/1.1
Host: localhost:5000
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64df45g7...",
      "crop_name": "Wheat",
      "market_name": "Azadpur Mandi",
      "price_per_quintal": 2200,
      "trend": "up",
      "last_updated": "2026-05-10T10:00:00Z"
    }
  ]
}
```

---

## 🛠️ Code Standards & Cleanliness
- **Modularity:** Backend controllers are strictly separated from business logic (services).
- **Graceful Shutdowns:** `SIGTERM` and `SIGINT` handlers are implemented to safely close database connections and HTTP servers.
- **Error Handling:** Centralized error handler middleware ensures clean API responses in case of failures.
- **Linting:** Code is maintained following standard ES6 paradigms with proper docstrings and console log cleanup.
