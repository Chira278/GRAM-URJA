import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///gram_urja.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'gram-urja-secret-2025')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

db = SQLAlchemy(app)
jwt = JWTManager(app)
geolocator = Nominatim(user_agent="gram_urja_energy")

print("✓ Flask initialized")
print("✓ CORS enabled")
print("✓ JWT configured")
print("✓ Geopy ready for geocoding")


# ==================== DATABASE MODELS ====================

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    villages = db.relationship('Village', backref='user', lazy=True, cascade='all, delete-orphan')
    reports = db.relationship('Report', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email, 'created_at': self.created_at.isoformat()}


class Village(db.Model):
    __tablename__ = 'villages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    country = db.Column(db.String(100), default='India')
    state = db.Column(db.String(100))
    district = db.Column(db.String(100))
    full_address = db.Column(db.Text)
    population = db.Column(db.String(50))
    area = db.Column(db.String(50))

    solar_score = db.Column(db.Float, default=0)
    wind_score = db.Column(db.Float, default=0)
    biomass_score = db.Column(db.Float, default=0)
    hydro_score = db.Column(db.Float, default=0)
    overall_score = db.Column(db.Float, default=0)

    analysis_data = db.Column(db.JSON, default=dict)
    recommendations = db.Column(db.JSON, default=list)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    analyzed_at = db.Column(db.DateTime)

    reports = db.relationship('Report', backref='village', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'country': self.country,
            'state': self.state,
            'district': self.district,
            'full_address': self.full_address,
            'population': self.population,
            'area': self.area,
            'solar_score': self.solar_score,
            'wind_score': self.wind_score,
            'biomass_score': self.biomass_score,
            'hydro_score': self.hydro_score,
            'overall_score': self.overall_score,
            'recommendations': self.recommendations,
            'created_at': self.created_at.isoformat(),
            'analyzed_at': self.analyzed_at.isoformat() if self.analyzed_at else None
        }


class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    village_id = db.Column(db.Integer, db.ForeignKey('villages.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    report_type = db.Column(db.String(50), default='comprehensive')
    report_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'report_type': self.report_type,
            'created_at': self.created_at.isoformat()
        }

print("✓ Database models configured")


# ==================== UTILITY FUNCTIONS ====================

def get_location_from_coordinates(latitude, longitude):
    try:
        location = geolocator.reverse(f"{latitude}, {longitude}", language='en', timeout=10)
        address = location.address
        parts = address.split(', ')

        return {
            'full_address': address,
            'country': parts[-1] if len(parts) > 0 else 'India',
            'state': parts[-2] if len(parts) > 1 else 'Unknown',
            'district': parts[-3] if len(parts) > 2 else 'Unknown',
            'success': True
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'full_address': f'Location at Latitude {latitude}, Longitude {longitude}'
        }


def calculate_energy_scores(latitude, longitude, state='Unknown'):
    # Solar score based on latitude
    solar_score = max(30, min(95, 50 + (25 - abs(latitude)) * 2))

    # Wind score - region specific
    wind_score = 45
    if any(s in state for s in ['Tamil Nadu', 'Gujarat', 'Karnataka', 'Andhra Pradesh']):
        wind_score = 70
    elif any(s in state for s in ['Rajasthan', 'Himachal', 'Uttarakhand', 'Ladakh']):
        wind_score = 60

    # Biomass score
    biomass_score = 65
    if any(s in state for s in ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh']):
        biomass_score = 80

    # Hydro score
    hydro_score = 35
    if any(s in state for s in ['Himachal', 'Uttarakhand', 'Meghalaya', 'Mizoram', 'Sikkim', 'Arunachal Pradesh']):
        hydro_score = 80
    elif any(s in state for s in ['Kerala', 'Jharkhand', 'Chhattisgarh', 'Odisha']):
        hydro_score = 60

    # Overall weighted average
    overall_score = (solar_score * 0.35 + wind_score * 0.25 + biomass_score * 0.20 + hydro_score * 0.20)

    return {
        'solar_score': round(solar_score, 1),
        'wind_score': round(wind_score, 1),
        'biomass_score': round(biomass_score, 1),
        'hydro_score': round(hydro_score, 1),
        'overall_score': round(overall_score, 1)
    }


def generate_recommendations(scores, village_name='Village'):
    recommendations = []

    # Solar
    if scores['solar_score'] >= 80:
        recommendations.append({
            'type': 'solar',
            'title': 'Solar PV Installation',
            'icon': '☀️',
            'score': scores['solar_score'],
            'priority': 'high',
            'description': f"Excellent solar potential ({scores['solar_score']}/100). Highly recommended!",
            'investment': '₹50-60 Lakhs/MW',
            'roi': '5-7 years',
            'annual_savings': '₹15-20 Lakhs'
        })
    elif scores['solar_score'] >= 60:
        recommendations.append({
            'type': 'solar',
            'title': 'Solar PV Installation',
            'icon': '☀️',
            'score': scores['solar_score'],
            'priority': 'medium',
            'description': f"Good solar potential ({scores['solar_score']}/100).",
            'investment': '₹40-50 Lakhs/MW',
            'roi': '7-9 years',
            'annual_savings': '₹10-15 Lakhs'
        })

    # Wind
    if scores['wind_score'] >= 65:
        recommendations.append({
            'type': 'wind',
            'title': 'Wind Turbine Installation',
            'icon': '💨',
            'score': scores['wind_score'],
            'priority': 'high',
            'description': f"Excellent wind potential ({scores['wind_score']}/100).",
            'investment': '₹40-50 Lakhs',
            'roi': '8-10 years',
            'annual_savings': '₹12-18 Lakhs'
        })
    elif scores['wind_score'] >= 50:
        recommendations.append({
            'type': 'wind',
            'title': 'Small Wind Turbines',
            'icon': '💨',
            'score': scores['wind_score'],
            'priority': 'medium',
            'description': f"Moderate wind potential ({scores['wind_score']}/100).",
            'investment': '₹25-35 Lakhs',
            'roi': '10-12 years',
            'annual_savings': '₹5-10 Lakhs'
        })

    # Biomass
    if scores['biomass_score'] >= 75:
        recommendations.append({
            'type': 'biomass',
            'title': 'Biogas Plant Setup',
            'icon': '🌱',
            'score': scores['biomass_score'],
            'priority': 'high',
            'description': f"Excellent biomass availability ({scores['biomass_score']}/100).",
            'investment': '₹30-40 Lakhs',
            'roi': '6-8 years',
            'annual_savings': '₹10-15 Lakhs'
        })
    elif scores['biomass_score'] >= 60:
        recommendations.append({
            'type': 'biomass',
            'title': 'Biogas Plant Setup',
            'icon': '🌱',
            'score': scores['biomass_score'],
            'priority': 'medium',
            'description': f"Good biomass potential ({scores['biomass_score']}/100).",
            'investment': '₹20-30 Lakhs',
            'roi': '8-10 years',
            'annual_savings': '₹8-12 Lakhs'
        })

    # Hydro
    if scores['hydro_score'] >= 70:
        recommendations.append({
            'type': 'hydro',
            'title': 'Micro-Hydro Project',
            'icon': '💧',
            'score': scores['hydro_score'],
            'priority': 'high',
            'description': f"Excellent water resources ({scores['hydro_score']}/100).",
            'investment': '₹50-70 Lakhs',
            'roi': '10-12 years',
            'annual_savings': '₹15-25 Lakhs'
        })
    elif scores['hydro_score'] >= 50:
        recommendations.append({
            'type': 'hydro',
            'title': 'Micro-Hydro Project',
            'icon': '💧',
            'score': scores['hydro_score'],
            'priority': 'medium',
            'description': f"Moderate water resources ({scores['hydro_score']}/100).",
            'investment': '₹40-60 Lakhs',
            'roi': '12-15 years',
            'annual_savings': '₹10-15 Lakhs'
        })

    return recommendations

print("✓ Utility functions configured")


# ==================== AUTH ROUTES ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user:
        user = User(username=data['username'], email=f"{data['username']}@gramurja.com")
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()

    if not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('username'):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400

    user = User(username=data['username'], email=data.get('email', f"{data['username']}@gramurja.com"))
    user.set_password(data.get('password', 'default'))

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered', 'user': user.to_dict()}), 201


@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200

print("✓ Auth routes configured")


# ==================== VILLAGE ROUTES ====================

@app.route('/api/village/create', methods=['POST'])
@jwt_required()
def create_village():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Missing village name'}), 400

    latitude = float(data.get('latitude', 28.7))
    longitude = float(data.get('longitude', 77.1))

    # Get location from coordinates
    location_data = get_location_from_coordinates(latitude, longitude)

    village = Village(
        user_id=user_id,
        name=data['name'],
        latitude=latitude,
        longitude=longitude,
        state=data.get('state', location_data.get('state', 'Unknown')),
        country=data.get('country', location_data.get('country', 'India')),
        district=location_data.get('district', 'Unknown'),
        full_address=location_data.get('full_address', 'Location found'),
        population=data.get('population', 'N/A'),
        area=data.get('area', 'N/A')
    )

    db.session.add(village)
    db.session.commit()

    return jsonify({'message': 'Village created successfully', 'village': village.to_dict()}), 201


@app.route('/api/village/list', methods=['GET'])
@jwt_required()
def list_villages():
    user_id = get_jwt_identity()
    villages = Village.query.filter_by(user_id=user_id).all()

    return jsonify([v.to_dict() for v in villages]), 200


@app.route('/api/village/<int:village_id>', methods=['GET'])
@jwt_required()
def get_village(village_id):
    user_id = get_jwt_identity()
    village = Village.query.filter_by(id=village_id, user_id=user_id).first()

    if not village:
        return jsonify({'error': 'Village not found'}), 404

    return jsonify(village.to_dict()), 200


@app.route('/api/village/<int:village_id>', methods=['DELETE'])
@jwt_required()
def delete_village(village_id):
    user_id = get_jwt_identity()
    village = Village.query.filter_by(id=village_id, user_id=user_id).first()

    if not village:
        return jsonify({'error': 'Village not found'}), 404

    db.session.delete(village)
    db.session.commit()

    return jsonify({'message': 'Village deleted successfully'}), 200

print("✓ Village routes configured")


# ==================== ANALYSIS ROUTES ====================

@app.route('/api/analysis/run/<int:village_id>', methods=['POST'])
@jwt_required()
def run_analysis(village_id):
    user_id = get_jwt_identity()
    village = Village.query.filter_by(id=village_id, user_id=user_id).first()

    if not village:
        return jsonify({'error': 'Village not found'}), 404

    # Calculate scores
    scores = calculate_energy_scores(village.latitude, village.longitude, village.state)

    # Generate recommendations
    recommendations = generate_recommendations(scores, village.name)

    # Update village
    village.solar_score = scores['solar_score']
    village.wind_score = scores['wind_score']
    village.biomass_score = scores['biomass_score']
    village.hydro_score = scores['hydro_score']
    village.overall_score = scores['overall_score']
    village.recommendations = recommendations
    village.analyzed_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        'message': 'Analysis completed',
        'village_id': village.id,
        'scores': scores,
        'recommendations': recommendations
    }), 200


@app.route('/api/analysis/<int:village_id>', methods=['GET'])
@jwt_required()
def get_analysis(village_id):
    user_id = get_jwt_identity()
    village = Village.query.filter_by(id=village_id, user_id=user_id).first()

    if not village:
        return jsonify({'error': 'Village not found'}), 404

    if not village.analyzed_at:
        return jsonify({'error': 'No analysis yet'}), 400

    return jsonify({
        'village_id': village.id,
        'village_name': village.name,
        'location': {
            'latitude': village.latitude,
            'longitude': village.longitude,
            'full_address': village.full_address,
            'state': village.state,
            'district': village.district
        },
        'scores': {
            'solar': village.solar_score,
            'wind': village.wind_score,
            'biomass': village.biomass_score,
            'hydro': village.hydro_score,
            'overall': village.overall_score
        },
        'recommendations': village.recommendations
    }), 200

print("✓ Analysis routes configured")


# ==================== REPORT ROUTES ====================

@app.route('/api/report/generate/<int:village_id>', methods=['POST'])
@jwt_required()
def generate_report(village_id):
    user_id = get_jwt_identity()
    village = Village.query.filter_by(id=village_id, user_id=user_id).first()

    if not village:
        return jsonify({'error': 'Village not found'}), 404

    if not village.analyzed_at:
        return jsonify({'error': 'Run analysis first'}), 400

    report = Report(
        user_id=user_id,
        village_id=village.id,
        filename=f"GRAM_URJA_{village.name.replace(' ', '_')}_{datetime.utcnow().strftime('%Y%m%d')}.txt",
        report_type='comprehensive',
        report_data={
            'village_name': village.name,
            'location': {
                'latitude': village.latitude,
                'longitude': village.longitude,
                'address': village.full_address,
                'state': village.state
            },
            'scores': {
                'solar': village.solar_score,
                'wind': village.wind_score,
                'biomass': village.biomass_score,
                'hydro': village.hydro_score,
                'overall': village.overall_score
            },
            'recommendations': village.recommendations
        }
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({'message': 'Report generated', 'report': report.to_dict()}), 201


@app.route('/api/report/list', methods=['GET'])
@jwt_required()
def list_reports():
    user_id = get_jwt_identity()
    reports = Report.query.filter_by(user_id=user_id).all()

    return jsonify([r.to_dict() for r in reports]), 200


@app.route('/api/report/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    user_id = get_jwt_identity()
    report = Report.query.filter_by(id=report_id, user_id=user_id).first()

    if not report:
        return jsonify({'error': 'Report not found'}), 404

    return jsonify({'report': report.to_dict(), 'data': report.report_data}), 200

print("✓ Report routes configured")


# ==================== HEALTH & INFO ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'GRAM URJA Backend API',
        'version': '2.0.0',
        'timestamp': datetime.utcnow().isoformat()
    }), 200


@app.route('/api/info', methods=['GET'])
def get_info():
    return jsonify({
        'name': 'GRAM URJA',
        'version': '2.0.0',
        'description': 'Renewable Energy Intelligence Platform',
        'features': ['Villages', 'Analysis', 'Geocoding', 'Reports']
    }), 200

print("✓ Health & Info routes configured")


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500

print("✓ Error handlers configured")


# ==================== MAIN ====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✓ Database initialized")
        print("\n" + "="*80)
        print("🌱 GRAM URJA BACKEND v2.0 - FULLY INITIALIZED")
        print("="*80)
        print("\n✓ Flask API")
        print("✓ SQLAlchemy ORM")
        print("✓ JWT Authentication")
        print("✓ CORS Enabled")
        print("✓ Geopy Geocoding")
        print("✓ Energy Analysis")
        print("✓ Recommendation System")
        print("✓ Report Generation")
        print("\n🚀 Starting server on http://0.0.0.0:5000")
        print("\nAPI Endpoints:")
        print("  POST /api/auth/login")
        print("  POST /api/village/create")
        print("  GET /api/village/list")
        print("  POST /api/analysis/run/<id>")
        print("  POST /api/report/generate/<id>")
        print("\n" + "="*80 + "\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
