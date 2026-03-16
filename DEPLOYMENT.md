# 🚀 Deployment Guide

This guide covers various deployment options for the Geopolitical Intelligence Dashboard.

## 📋 Prerequisites

- **NewsData API Key**: Required for news aggregation
- **Server**: Linux/Windows/macOS with Docker or Python/Node.js
- **Domain**: Optional, for production deployment
- **SSL Certificate**: Recommended for production

## 🔧 Environment Setup

### **1. API Keys Required**

#### NewsData API (Required)
1. Visit [NewsData.io](https://newsdata.io/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to environment: `NEWSDATA_APIKEY=your_key_here`

#### GDELT API (Free)
- No API key required
- Public global events database

### **2. Environment Variables**

Create `geo-backend/.env`:
```env
# NewsData Configuration
NEWSDATA_URL=https://newsdata.io/api/1/latest
NEWSDATA_APIKEY=your_newsdata_api_key_here

# GDELT Configuration
GDELT_URL=https://api.gdeltproject.org/api/v2/context/context

# Cache Configuration
CACHE_TTL_SECONDS=1200

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration (Production)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🐳 Docker Deployment (Recommended)

### **Development**
```bash
# Clone and setup
git clone <repository-url>
cd geopolitical-dashboard
./setup.sh

# Start with Docker Compose
docker-compose up --build
```

### **Production**
```bash
# Create production environment file
cp geo-backend/.env.example geo-backend/.env.production
# Edit with production values

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d --build
```

### **Production Docker Compose**
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./geo-backend
    ports:
      - "8000:8000"
    env_file:
      - ./geo-backend/.env.production
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./geo-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=https://your-api-domain.com
    restart: always
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: always
```

## 🖥️ Manual Deployment

### **Backend (FastAPI)**
```bash
cd geo-backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export NEWSDATA_APIKEY="your_key_here"
export ALLOWED_ORIGINS="https://yourdomain.com"

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### **Frontend (React)**
```bash
cd geo-frontend

# Install dependencies
npm install

# Set API URL
export REACT_APP_API_URL="https://your-api-domain.com"

# Build for production
npm run build

# Serve with nginx or apache
# Or use a simple server:
npx serve -s build -l 3000
```

## 🌐 Nginx Configuration

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS configuration
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL certificates
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

## ☁️ Cloud Deployment

### **AWS EC2**
```bash
# Launch EC2 instance (Ubuntu 20.04)
# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Clone and deploy
git clone <repository-url>
cd geopolitical-dashboard
docker-compose up -d --build
```

### **Google Cloud Platform**
```bash
# Create VM instance
gcloud compute instances create geopolitical-dashboard \
    --machine-type=e2-medium \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --tags=http-server,https-server

# Deploy
gcloud compute scp geopolitical-dashboard/ geopolitical-dashboard:~ --recursive
gcloud compute ssh geopolitical-dashboard
cd geopolitical-dashboard
docker-compose up -d --build
```

### **Azure Virtual Machine**
```bash
# Create Ubuntu VM
# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y

# Deploy application
git clone <repository-url>
cd geopolitical-dashboard
docker-compose up -d --build
```

## 🔒 Security Considerations

### **Production Security**
1. **Use HTTPS**: SSL/TLS certificates required
2. **Environment Variables**: Never commit API keys
3. **Firewall**: Only open necessary ports (80, 443)
4. **Regular Updates**: Keep dependencies updated
5. **Monitoring**: Set up logging and monitoring

### **API Security**
```python
# Rate limiting (add to main.py)
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/")
@limiter.limit("100/minute")
async def api_endpoint():
    pass
```

### **CORS Configuration**
```python
# Production CORS settings
allowed_origins = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

## 📊 Monitoring & Logging

### **Health Checks**
Add to `main.py`:
```python
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}
```

### **Logging Configuration**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## 🔄 CI/CD Pipeline

### **GitHub Actions**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/app
          git pull
          docker-compose up -d --build
```

## 🚨 Troubleshooting

### **Common Issues**

1. **API Key Not Working**
   - Verify NewsData API key is valid
   - Check environment variables are loaded
   - Review API rate limits

2. **CORS Errors**
   - Check allowed origins in backend
   - Verify frontend API URL
   - Check browser console for errors

3. **High Memory Usage**
   - Reduce cache TTL
   - Monitor container resources
   - Add memory limits to Docker

4. **Slow Performance**
   - Check cache hit rates
   - Monitor API response times
   - Consider CDN for static assets

### **Health Monitoring**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Monitor resources
docker stats
```

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review GitHub Issues
3. Check application logs
4. Verify environment configuration

---

**Remember**: Never commit API keys or sensitive configuration to version control!
