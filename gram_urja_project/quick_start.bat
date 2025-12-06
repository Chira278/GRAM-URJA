@echo off
echo ================================================
echo GRAM URJA - Quick Start Script (Windows)
echo ================================================

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed!
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed!
    exit /b 1
)

echo Prerequisites checked

REM Backend setup
echo.
echo Setting up Backend...
cd backend

if not exist "venv" (
    python -m venv venv
    echo Virtual environment created
)

call venv\Scripts\activate
pip install -r requirements.txt
echo Backend dependencies installed

if not exist ".env" (
    echo Creating .env file...
    echo SECRET_KEY=your-secret-key-here > .env
    echo JWT_SECRET_KEY=your-jwt-key-here >> .env
    echo DATABASE_URL=sqlite:///gram_urja.db >> .env
    echo OPENWEATHER_API_KEY=your_key_here >> .env
    echo NASA_POWER_API_KEY=DEMO_KEY >> .env
    echo .env file created
)

cd ..

REM Frontend setup
echo.
echo Setting up Frontend...
cd frontend

if not exist "node_modules" (
    npm install
    echo Frontend dependencies installed
)

if not exist ".env" (
    echo REACT_APP_API_URL=http://localhost:5000/api > .env
    echo Frontend .env created
)

cd ..

echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python app.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo Then open: http://localhost:3000
echo ================================================
pause
