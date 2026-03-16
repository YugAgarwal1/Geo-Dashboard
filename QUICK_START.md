# ⚡ Quick Start Guide

Get your Geopolitical Intelligence Dashboard running in 5 minutes!

## 🚀 One-Command Setup

```bash
# Clone and run setup script
git clone <repository-url>
cd geopolitical-dashboard
chmod +x setup.sh
./setup.sh
```

## 📋 What You Need

1. **NewsData API Key** (Free tier available)
   - Sign up: [newsdata.io](https://newsdata.io/)
   - Get your API key from dashboard

2. **Python 3.9+ & Node.js 16+**
   - Or use Docker (recommended)

## 🔧 Quick Configuration

### **Option 1: Docker (Easiest)**
```bash
# 1. Get API key from NewsData.io
# 2. Edit geo-backend/.env with your API key
# 3. Run:
docker-compose up --build

# Visit: http://localhost:3000
```

### **Option 2: Manual Setup**
```bash
# Terminal 1 - Backend
cd geo-backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd geo-frontend
npm install
npm start

# Visit: http://localhost:3000
```

## ✅ Verification Checklist

- [ ] NewsData API key added to `.env`
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Dashboard loads with country data
- [ ] Top tension zones showing countries
- [ ] Analytics page displays charts

## 🎯 First Steps

1. **Explore the Dashboard**
   - Click countries on the world map
   - Check top tension zones
   - Browse analytics charts

2. **Test Features**
   - Search for specific countries
   - Filter news by category
   - View country-specific analysis

3. **API Documentation**
   - Visit: http://localhost:8000/docs
   - Test API endpoints directly

## 🆘 Common Issues

**"No countries showing"**
- Check your NewsData API key
- Verify backend is running
- Check browser console for errors

**"CORS errors"**
- Ensure both frontend and backend are running
- Check ports: Frontend (3000), Backend (8000)

**"API key not working"**
- Verify key from NewsData.io
- Check `.env` file location
- Restart backend after changes

## 📚 Need More Help?

- 📖 **Full Documentation**: [README.md](README.md)
- 🚀 **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 **Issues**: Check GitHub Issues page

## 🎉 You're Ready!

Your intelligence dashboard is now monitoring global tensions in real-time!

**Access Points:**
- 🌐 **Dashboard**: http://localhost:3000
- 📊 **Analytics**: http://localhost:3000/analytics
- 📰 **News Feed**: http://localhost:3000/news
- 🗺️ **Country Analysis**: http://localhost:3000/country/[country-name]
- 🔧 **API Docs**: http://localhost:8000/docs

---

**Happy Intelligence Gathering! 🕵️**
