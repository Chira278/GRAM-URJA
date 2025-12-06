# GRAM URJA - Renewable Energy Assessment Platform

## 🌱 Project Overview

**Gram Urja** is a comprehensive geospatial analytics platform designed to assess renewable energy potential in rural villages worldwide. The platform analyzes solar, wind, biomass, and hydro energy resources using satellite data, weather APIs, and machine learning to provide actionable insights for clean energy adoption.

### Key Features

✅ **User Authentication** - Secure login/logout with JWT tokens  
✅ **Village Input & Geocoding** - Search and locate villages on interactive maps  
✅ **Multi-Source Data Collection** - Solar (GHI/DNI/DHI), Wind, Biomass, Hydro  
✅ **Geospatial Analysis Engine** - 4 parallel analysis modules + unified scoring  
✅ **Energy Potential Scores** - Individual scores (0-100) for each energy type  
✅ **Limiting Factors Identification** - AI-powered constraint analysis  
✅ **Actionable Recommendations** - Prioritized implementation guidance  
✅ **Dynamic Visualizations** - Interactive charts, maps, and dashboards  
✅ **PDF Report Generation** - Comprehensive reports with embedded charts  
✅ **Progress Tracking** - Historical data and comparative analysis

---

## 🏗️ Architecture

### Frontend
- **Framework**: React.js 18
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Maps**: React-Leaflet
- **Charts**: Recharts & Chart.js
- **Routing**: React Router v6

### Backend
- **Framework**: Flask (Python)
- **Authentication**: JWT (Flask-JWT-Extended)
- **Database**: PostgreSQL / SQLite
- **ORM**: SQLAlchemy
- **APIs**: NASA POWER, OpenWeatherMap, Sentinel Hub

### AI/ML
- **Libraries**: Scikit-learn, XGBoost
- **Models**: Predictive scoring, Classification, Time series

---

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or SQLite for development)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/gram-urja.git
cd gram-urja/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=postgresql://username:password@localhost/gram_urja
OPENWEATHER_API_KEY=your-openweather-key
NASA_POWER_API_KEY=DEMO_KEY
```

5. **Initialize database**
```bash
python
>>> from app import create_app, db
>>> app = create_app()
>>> with app.app_context():
>>>     db.create_all()
>>> exit()
```

6. **Run the backend server**
```bash
python app.py
```
Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Run the frontend**
```bash
npm start
```
Frontend will run on `http://localhost:3000`

---

## 🚀 Usage

### 1. Register/Login
- Open `http://localhost:3000`
- Register a new account or login
- JWT token will be stored for authenticated requests

### 2. Add Village
- Click "Add New Village" button
- Search for a village by name
- Select the village from search results
- Village will be added to your dashboard

### 3. Run Analysis
- Click on any village card
- Click "Run Analysis" button
- System will:
  - Collect solar, wind, biomass, and hydro data
  - Calculate potential scores (0-100)
  - Identify limiting factors
  - Generate recommendations

### 4. View Results
- **Energy Scores Dashboard**
  - Solar, Wind, Biomass, Hydro scores
  - Overall renewable energy potential
  - Interactive charts and visualizations

- **Limiting Factors**
  - Identified constraints
  - Severity levels
  - Detailed descriptions

- **Recommendations**
  - Prioritized action items
  - Cost estimates
  - Implementation steps
  - ROI projections

### 5. Generate PDF Report
- Click "Generate Report" button
- Comprehensive PDF with:
  - Village profile
  - All energy scores
  - Charts and graphs
  - Recommendations
  - Cost analysis

---

## 📊 Data Sources

| Data Type | Source | Parameters |
|-----------|--------|------------|
| Solar Irradiance | NASA POWER | GHI, DNI, DHI |
| Wind Data | OpenWeatherMap | Speed, Direction, Gust |
| Satellite Imagery | Sentinel Hub | LULC, NDVI |
| Elevation | SRTM DEM | Terrain data |
| Geocoding | Nominatim | Location services |

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Village
- `POST /api/village/search` - Search village
- `POST /api/village/create` - Create village entry
- `GET /api/village/{id}` - Get village details
- `GET /api/village/list` - List all villages

### Data Collection
- `POST /api/data/collect` - Collect all energy data
- `GET /api/data/solar/{village_id}` - Get solar data
- `GET /api/data/wind/{village_id}` - Get wind data

### Analysis
- `POST /api/analysis/run` - Run full analysis
- `GET /api/analysis/scores/{village_id}` - Get energy scores
- `GET /api/analysis/limiting-factors/{village_id}` - Get constraints
- `GET /api/analysis/recommendations/{village_id}` - Get recommendations

### Reports
- `POST /api/reports/generate` - Generate PDF report
- `GET /api/reports/download/{report_id}` - Download report
- `GET /api/reports/list` - List all reports

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📈 Future Enhancements

- [ ] Real-time satellite imagery integration
- [ ] Mobile app (React Native)
- [ ] Advanced ML models for prediction
- [ ] Multi-language support
- [ ] Offline mode with data caching
- [ ] Integration with government databases
- [ ] Installer marketplace
- [ ] Community forum
- [ ] Cost calculator with financing options
- [ ] Progress tracking and monitoring dashboard

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Team Name**: Urja Vanni  
**Theme**: Environmental Sustainability  
**College**: CEC-CGC Landran, Mohali  
**Branch**: Computer Science (Data Science)

---

## 📞 Contact

For questions, support, or collaboration:
- **Email**: contact@gramurja.com
- **Website**: https://gramurja.com
- **GitHub**: https://github.com/your-username/gram-urja

---

## 🙏 Acknowledgments

- NASA POWER for solar irradiance data
- OpenWeatherMap for weather data
- Sentinel Hub for satellite imagery
- ESA Copernicus for Earth observation data
- Ministry of New and Renewable Energy (MNRE), India

---

**Together, we're not just analyzing maps; We're mapping a brighter, cleaner future for all! 🌍💚⚡**
