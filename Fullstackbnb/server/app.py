#!/usr/bin/env python3

from flask import Flask
from models import db, User, Booking, Listing, Favorites, Review, TokenBlocklist
from flask_migrate import Migrate
from views.user import user_bp
from views.host import host_blueprint
from views.listing import listing_bp
from views.admin import admin_blueprint
from views.booking import booking_bp
from views.favorite import favorite_bp
from views.review import review_bp
from views.auth import auth_bp
from flask_cors import CORS
import os
from datetime import timedelta
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Configure CORS - UPDATED TO ALLOW MORE ORIGINS
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173", 
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "https://localhost:5173",
            # Add your frontend deployment URL here
            # Example: "https://your-frontend-app.netlify.app",
            # For now, allowing all origins for testing (remove in production)
            "*"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    ''
).replace('postgres://', 'postgresql://')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)
migrate = Migrate(app, db)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET', 'your-fallback-secret-key')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(host_blueprint)
app.register_blueprint(listing_bp)
app.register_blueprint(admin_blueprint)
app.register_blueprint(booking_bp)
app.register_blueprint(favorite_bp)
app.register_blueprint(review_bp)
app.register_blueprint(auth_bp)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

@app.route('/')
def home():
    return '<h1>Airbnb Booking API is Running!</h1>'

@app.route('/health')
def health_check():
    try:
        db.session.execute('SELECT 1')
        return {'status': 'healthy'}, 200
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 500

# Add this route to test API connectivity
@app.route('/api/test')
def test_api():
    return {'message': 'API is working!', 'status': 'success'}, 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5555))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', 'False') == 'True')