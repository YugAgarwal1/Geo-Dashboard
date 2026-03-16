# GeoTension — Global Geopolitical Intelligence Monitor

A sophisticated React frontend for visualizing global geopolitical tensions through interactive maps, charts, and real-time data.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app runs at `http://localhost:3000`

## 🔧 Configuration

Set your backend API URL in a `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000
```

If no API is running, the app uses built-in mock data automatically.

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Dashboard — map, global gauge, top zones, news feed |
| `/tensions` | Advanced map with filters, table ranking |
| `/news` | Intelligence feed with search & filter |
| `/country/:name` | Country detail — gauge, trend, breakdown |
| `/analytics` | Charts, trends, regional comparison |

## 🗂 Project Structure

```
src/
├── components/
│   ├── common/     Header, Loading, ErrorBoundary
│   ├── map/        WorldMap, TensionLegend, CountryOverlay
│   ├── charts/     TensionGauge, TrendChart, CategoryChart
│   ├── news/       NewsCard, NewsFeed, ArticleModal
│   └── country/    CountryCard, CountryModal, CountryDetails
├── pages/          Dashboard, Tensions, News, Country, Analytics
├── hooks/          useApi, useMap, useFilters
├── services/       api.js (with mock fallback)
├── context/        AppContext.js
└── utils/          tensionColors, formatters, constants
```

## 🎨 Tech Stack

- **React 18** with JSX + lazy loading
- **React Router v6** for routing
- **Leaflet.js** for interactive maps
- **Chart.js + react-chartjs-2** for visualizations
- **Axios** for API calls (with mock fallback)
- **Lucide React** for icons
- **date-fns** for date formatting
- Custom dark theme via CSS variables

## 🔌 API Endpoints Expected

```
GET /           → { global_tension_index, top_countries, news, countries }
GET /news       → [ articles ]
GET /news/:cat  → [ articles filtered by category ]
GET /country/:name → { ...country, trend, news, related_countries }
```

## 🌐 Features

- ✅ Interactive world map with tension markers
- ✅ Animated tension gauges (canvas-based)
- ✅ Trend line charts (60-day history)
- ✅ Category breakdown charts (bar + radar)
- ✅ News feed with filtering and search
- ✅ Country detail pages
- ✅ Analytics dashboard
- ✅ Global state management (React Context)
- ✅ Auto-refresh every 5 minutes
- ✅ Mock data fallback when API unavailable
- ✅ Responsive design (mobile-friendly)
- ✅ Dark theme throughout
- ✅ Error boundaries + loading states
- ✅ Keyboard accessible modals
