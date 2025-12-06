# GRAM URJA - Detailed Setup Guide

## System Requirements

### Hardware
- **Minimum**: 4GB RAM, 2 CPU cores, 20GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 50GB storage

### Software
- **Operating System**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Python**: 3.9 or higher
- **Node.js**: 16.x or higher
- **Database**: PostgreSQL 13+ (or SQLite for development)
- **Git**: Latest version

---

## Step-by-Step Installation

### 1. Database Setup (PostgreSQL)

#### Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql

# Windows
# Download installer from https://www.postgresql.org/download/windows/
```

#### Create Database
```bash
sudo -u postgres psql
CREATE DATABASE gram_urja;
CREATE USER gram_urja_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gram_urja TO gram_urja_user;
\q
```

### 2. Backend Setup

#### Clone Repository
```bash
git clone https://github.com/your-username/gram-urja.git
cd gram-urja
```

#### Setup Python Environment
```bash
cd backend
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

#### Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Configure Environment Variables
Create `.env` file in `backend/` directory:

```env
# Flask Configuration
SECRET_KEY=generate-a-random-secret-key-here
JWT_SECRET_KEY=generate-another-random-key-here
FLASK_ENV=development
FLASK_DEBUG=True

# Database
DATABASE_URL=postgresql://gram_urja_user:your_password@localhost:5432/gram_urja

# API Keys
OPENWEATHER_API_KEY=get-from-openweathermap.org
NASA_POWER_API_KEY=DEMO_KEY
SENTINEL_HUB_CLIENT_ID=get-from-sentinel-hub
SENTINEL_HUB_CLIENT_SECRET=get-from-sentinel-hub

# CORS
CORS_ORIGINS=http://localhost:3000
```

#### Generate Secret Keys
```python
import secrets
print("SECRET_KEY:", secrets.token_hex(32))
print("JWT_SECRET_KEY:", secrets.token_hex(32))
```

#### Initialize Database
```bash
python
```
```python
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print("Database initialized successfully!")
exit()
```

#### Run Backend Server
```bash
python app.py
```

Backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Node Dependencies
```bash
npm install
```

If you encounter errors:
```bash
npm install --legacy-peer-deps
```

#### Configure Environment
Create `.env` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### Run Frontend Server
```bash
npm start
```

Frontend should now be running on `http://localhost:3000`

---

## API Key Setup

### OpenWeatherMap API

1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key
5. Add to backend `.env` file

### NASA POWER API

- Free tier available with `DEMO_KEY`
- For production, register at https://api.nasa.gov/
- Replace `NASA_POWER_API_KEY` in `.env`

### Sentinel Hub (Optional)

1. Go to https://www.sentinel-hub.com/
2. Create account
3. Get OAuth credentials
4. Add Client ID and Secret to `.env`

---

## Verification

### Check Backend
```bash
curl http://localhost:5000/api/health
# Expected: {"status": "healthy", "message": "Gram Urja API is running"}
```

### Check Frontend
1. Open browser: `http://localhost:3000`
2. You should see the login page
3. Create a test account

---

## Common Issues & Solutions

### Issue: Port Already in Use

**Backend (Port 5000)**
```bash
# Find process using port 5000
lsof -i :5000  # Linux/macOS
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

**Frontend (Port 3000)**
```bash
# Change port in package.json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}
```

### Issue: Database Connection Error

- Verify PostgreSQL is running: `sudo service postgresql status`
- Check DATABASE_URL in `.env`
- Ensure database and user exist

### Issue: Module Not Found

**Backend**
```bash
pip install -r requirements.txt --force-reinstall
```

**Frontend**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors

- Ensure backend `.env` has correct `CORS_ORIGINS`
- Check Flask-CORS configuration in `app.py`

---

## Development Tips

### Hot Reload
- Backend: Flask auto-reloads with `debug=True`
- Frontend: React hot-reloads automatically

### Database Migrations
```bash
# After model changes
flask db init
flask db migrate -m "description"
flask db upgrade
```

### Clear Cache
```bash
# Backend
rm -rf __pycache__

# Frontend
rm -rf node_modules/.cache
```

---

## Production Deployment

### Backend (Using Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (Build for Production)
```bash
cd frontend
npm run build
# Serve the build folder using nginx or serve
```

### Docker Deployment
```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d
```

---

## Next Steps

1. ✅ Complete installation
2. ✅ Test all features
3. 📖 Read API documentation
4. 🚀 Deploy to production
5. 🎯 Configure production APIs
6. 🔒 Enable HTTPS
7. 📊 Setup monitoring

---

For more help, refer to:
- [README.md](README.md) - Project overview
- [API_DOCS.md](API_DOCS.md) - API documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
