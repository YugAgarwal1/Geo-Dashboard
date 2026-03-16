# 🌍 Geopolitical Intelligence Dashboard

A real-time geopolitical intelligence platform that analyzes global tensions, news events, and country-specific threat assessments using advanced AI and machine learning.

## 🚀 Features

### **Core Intelligence**
- **Real-time Global Tension Mapping**: Interactive world map with live tension scores
- **Country-Specific Analysis**: Detailed threat assessments for 200+ countries
- **Category-Based Intelligence**: War, Geopolitics, Oil & Energy, Economic, Cyber threats
- **Automated Tension Scoring**: AI-powered threat level calculations (0-100 scale)

### **Data Sources**
- **GDELT Project**: Real-time global event monitoring
- **NewsData API**: Comprehensive news aggregation
- **Entity Detection**: Automatic country and organization identification
- **Tension Engine**: Advanced threat assessment algorithms

### **Interactive Dashboard**
- **Live Analytics**: Real-time charts and visualizations
- **Top Tension Zones**: Ranked list of highest-risk countries
- **Category Breakdown**: Threat analysis by sector
- **Historical Trends**: 60-day tension evolution tracking

## 🛠️ Technology Stack

### **Frontend (React)**
- **React 18**: Modern component-based architecture
- **Chart.js**: Interactive data visualizations
- **Lucide React**: Beautiful icon system
- **CSS Variables**: Responsive dark theme

### **Backend (FastAPI/Python)**
- **FastAPI**: High-performance async API framework
- **GDELT Integration**: Real-time event data processing
- **NLP Processing**: Entity detection and tension analysis
- **Redis-style Caching**: 20-minute intelligent caching

### **AI/ML Features**
- **Entity Detection**: Named entity recognition for countries
- **Tension Calculation**: Multi-factor threat assessment
- **Category Classification**: Automatic threat categorization
- **Conflict Detection**: Bilateral tension analysis

## 📦 Installation & Setup

### **Prerequisites**
- Python 3.9+
- Node.js 16+
- Git

### **Backend Setup**
```bash
cd geo-backend
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Frontend Setup**
```bash
cd geo-frontend
npm install

# Start the development server
npm start
```

### **Environment Configuration**

#### Backend (.env)
```env
NEWSDATA_URL=https://newsdata.io/api/1/latest
NEWSDATA_APIKEY=your_newsdata_api_key_here
GDELT_URL=https://api.gdeltproject.org/api/v2/context/context
CACHE_TTL_SECONDS=1200
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🔑 API Keys Required

### **NewsData API**
1. Sign up at [NewsData.io](https://newsdata.io/)
2. Get your free API key
3. Add to `.env` file as `NEWSDATA_APIKEY`

### **GDELT API**
- Free public API (no key required)
- Real-time global event data

## 📊 API Endpoints

### **Core Endpoints**
- `GET /` - Main dashboard data (tensions + news)
- `GET /news` - Combined news feed (NewsData + GDELT)
- `GET /news/{category}` - Category-specific news
- `GET /country/{name}` - Country-specific analysis
- `GET /analytics` - Advanced analytics data

### **Category Endpoints**
- `GET /news/war` - War and conflict news
- `GET /news/oil` - Oil and energy news
- `GET /news/geopolitics` - Geopolitical news
- `GET /news/markets` - Market and economic news

## 🎯 Key Features

### **Tension Scoring System**
- **0-19**: Minimal Risk
- **20-39**: Low Risk
- **40-59**: Medium Risk
- **60-79**: High Risk
- **80-100**: Critical Risk

### **Real-time Updates**
- **Cache Duration**: 20 minutes
- **Background Refresh**: Automatic data updates
- **Performance Optimized**: Subsequent requests served from cache

### **Interactive Elements**
- **World Map**: Click countries for detailed analysis
- **Dynamic Charts**: Real-time data visualization
- **Responsive Design**: Mobile-friendly interface
- **Dark Theme**: Professional intelligence dashboard aesthetic

## 🔒 Security Features

- **Environment Variables**: All API keys secured
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Sanitized API parameters
- **Rate Limiting**: Built-in request throttling
- **No Hardcoded Secrets**: Secure configuration management

## 📈 Performance

- **Backend**: FastAPI with async request handling
- **Frontend**: React with optimized re-renders
- **Caching**: Multi-level intelligent caching
- **Data Compression**: Optimized API responses
- **Lazy Loading**: Component-based code splitting

## 🧪 Development

### **Running Tests**
```bash
# Backend tests
cd geo-backend
python -m pytest

# Frontend tests
cd geo-frontend
npm test
```

### **Code Quality**
- **ESLint**: Frontend code linting
- **Black**: Python code formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety (frontend)

## 📁 Project Structure

```
Projects/
├── geo-backend/          # FastAPI backend
│   ├── app/
│   │   ├── main.py      # Main application
│   │   ├── services/    # Business logic
│   │   └── country_info_service.py
│   ├── .env.example     # Environment template
│   └── requirements.txt # Python dependencies
├── geo-frontend/        # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── package.json     # Node dependencies
├── .gitignore           # Git ignore rules
└── README.md           # This file
```

## 🚀 Deployment

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### **Production Notes**
- Use HTTPS in production
- Configure proper CORS origins
- Set up monitoring and logging
- Use production-grade secrets management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the documentation
- Contact the development team

## 🔮 Future Roadmap

- **Real-time WebSocket Updates**: Live data streaming
- **Mobile App**: React Native application
- **Advanced ML Models**: Enhanced threat prediction
- **Historical Analysis**: Long-term trend analysis
- **Alert System**: Email/SMS threat notifications
- **Multi-language Support**: International localization

---

**Built with ❤️ for geopolitical intelligence analysis**
