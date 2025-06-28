from flask import Blueprint, request, jsonify
from models import db, User, Booking, Favorites, Review, Listing
from datetime import datetime
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user', __name__)

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if current_user.role == 'guest':
        if not current_user or current_user.id != user_id:
            return jsonify({"error": "You are not authorized to update this account!"}), 403

        
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email, 'role': user.role})

    

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'guest')

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    existing_email = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    if existing_email:
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        username=username,
        email=email,
        password=generate_password_hash(password),
        role=role
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": "New user created successfully!"}), 201


@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    user = User.query.get(user_id)
    if not current_user or current_user.role != 'guest':
        return jsonify({"error": "You are not authorized to update this account!"}), 403

    data = request.json
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    if 'role' in data:
        if current_user.role == 'admin':
            user.role = data['role']
        else:
            return jsonify({"error": "You are not authorized to change the role!"}), 403

    db.session.commit()
    return jsonify({"success": "User updated successfully!"})


@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    user = User.query.get(user_id)
    if not current_user or current_user.role != 'guest':
        return jsonify({"error": "You are not authorized to delete this account!"}), 403
    Booking.query.filter_by(user_id=user.id).delete()
    Favorites.query.filter_by(user_id=user.id).delete()
    Review.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": "User deleted successfully!"})

@user_bp.route('/users/bookings/<int:listing_id>', methods=['POST'])
@jwt_required()
def book_listing_for_user(listing_id):
    data = request.get_json()
    user_id = get_jwt_identity()

    check_in = data.get('check_in')
    check_out = data.get('check_out')

    # Ensure required fields are present
    if not check_in or not check_out:
        return jsonify({'error': 'Check-in and check-out dates are required'}), 400

    # Convert string to date
    try:
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    # Validate date logic
    if check_out_date <= check_in_date:
        return jsonify({'error': 'Check-out must be after check-in'}), 400

    # Confirm listing exists
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    # Check for overlapping bookings
    overlapping = Booking.query.filter(
        Booking.listing_id == listing_id,
        Booking.check_out > check_in_date,
        Booking.check_in < check_out_date
    ).first()
    if overlapping:
        return jsonify({'error': 'Listing is not available for the selected dates'}), 400

    # ✅ Calculate total_price internally
    nights = (check_out_date - check_in_date).days
    total_price = listing.price_per_night * nights 

    # Create and store booking
    new_booking = Booking(
        user_id=user_id,
        listing_id=listing_id,
        check_in=check_in_date,
        check_out=check_out_date,
        total_price=total_price
    )

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({
        'message': 'Booking successful',
        'booking': {
            'id': new_booking.id,
            'user_id': user_id,
            'listing_id': listing_id,
            'check_in': new_booking.check_in.isoformat(),
            'check_out': new_booking.check_out.isoformat(),
            'total_price': new_booking.total_price
        }
    }), 201

