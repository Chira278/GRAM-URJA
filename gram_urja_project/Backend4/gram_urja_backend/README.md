# GRAM URJA BACKEND API

Complete renewable energy assessment backend with Geopy geocoding.

## Setup

1. Extract files
2. Create virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   .\\venv\\Scripts\\Activate.ps1  # Windows
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run:
   ```
   python app.py
   ```

Server runs on: http://localhost:5000

## API Endpoints

POST /api/auth/login
POST /api/village/create
GET /api/village/list
GET /api/village/<id>
POST /api/analysis/run/<id>
GET /api/analysis/<id>
POST /api/report/generate/<id>
GET /api/report/list
GET /api/health

## Features

✓ Geopy Geocoding (Nominatim)
✓ Energy Analysis
✓ Recommendations
✓ JWT Authentication
✓ CORS Enabled
✓ SQLite Database

## Login

Username: test
Password: test
