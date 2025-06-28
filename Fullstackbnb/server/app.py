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
# setting up flask-cors 
from flask_cors import CORS
import os
from datetime import timedelta

# JWT importations
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Use local app.db in the server directory
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://airbnb_db_zf6o_user:XRrfBgpe7sInmOtV12qsFzw6cIeeKPRQ@dpg-d1g4bt2li9vc73a8eq8g-a.oregon-postgres.render.com/airbnb_db_zf6o'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate = Migrate(app, db)
db.init_app(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = "wyhjmmxmjhhdytd"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
jwt = JWTManager(app)
jwt.init_app(app)



# Views go here!
app.register_blueprint(user_bp)
app.register_blueprint(host_blueprint)
app.register_blueprint(listing_bp)
app.register_blueprint(admin_blueprint)
app.register_blueprint(booking_bp)
app.register_blueprint(favorite_bp)
app.register_blueprint(review_bp)
app.register_blueprint(auth_bp)

# Callback function to check if a JWT exists in the database blocklist


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None


@app.route('/')
def home():
    return '<h1>Airbnb Booking</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
