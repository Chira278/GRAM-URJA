#!/bin/bash

echo "================================================"
echo "GRAM URJA - Quick Start Script"
echo "================================================"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed!"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    exit 1
fi

echo "✅ Prerequisites checked"

# Backend setup
echo ""
echo "Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

source venv/bin/activate
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
JWT_SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
DATABASE_URL=sqlite:///gram_urja.db
OPENWEATHER_API_KEY=your_key_here
NASA_POWER_API_KEY=DEMO_KEY
EOF
    echo "✅ .env file created (edit with your API keys)"
fi

# Initialize database
python3 << EOF
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print("✅ Database initialized")
EOF

cd ..

# Frontend setup
echo ""
echo "Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
fi

if [ ! -f ".env" ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    echo "✅ Frontend .env created"
fi

cd ..

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then open: http://localhost:3000"
echo "================================================"
