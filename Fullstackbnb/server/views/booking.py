from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking, User, Listing
from datetime import datetime

booking_bp = Blueprint('booking', __name__)

# ========== Get all bookings for a user =========
@booking_bp.route('/users/<int:user_id>/bookings', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).all()
    result = []
    for booking in bookings:
        result.append({
            "id": booking.id,
            "listing_id": booking.listing_id,
            "check_in": booking.check_in,
            "check_out": booking.check_out,
            "status": booking.booking_status,
            "total_price": booking.total_price,
            "created_at": booking.created_at
        })
    return jsonify(result), 200


@booking_bp.route('/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if booking:
        return jsonify({
            "id": booking.id,
            "guest": booking.guest.username,
            "listing": booking.listing.title,
            "checkin": booking.check_in,
            "checkout": booking.check_out,
            "status": booking.booking_status,
        })
    return jsonify({"error": "Booking not found"}), 404

# Look at it later

@booking_bp.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()


    current_user_id = int(get_jwt_identity())  # Convert string to int for consistency
    listing_id = data.get('listing_id')
    check_in = data.get('check_in')
    check_out = data.get('check_out')
    total_price = data.get('total_price', 0)  # Add total_price handling

    if not (listing_id and check_in and check_out):
        return jsonify({'error': 'Missing required fields'}), 400

    # Convert date strings to date objects
    try:
        check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
        check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    # Optional: check if listing exists
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    # Check for overlapping bookings
    overlapping = Booking.query.filter(
        Booking.listing_id == listing_id,
        Booking.check_out > check_in_date,
        Booking.check_in < check_out_date,
        Booking.booking_status != 'cancelled'  # Don't consider cancelled bookings
    ).first()
    if overlapping:
        return jsonify({'error': 'Listing is not available for the selected dates.'}), 400

    # Create booking
    new_booking = Booking(
        user_id=current_user_id,
        listing_id=listing_id,
        check_in=check_in_date,
        check_out=check_out_date,
        total_price=total_price,
        booking_status='pending'  # Set initial status
    )
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({
        'id': new_booking.id,
        'listing_id': new_booking.listing_id,
        'user_id': new_booking.user_id,
        'check_in': new_booking.check_in.isoformat(),
        'check_out': new_booking.check_out.isoformat(),
        'total_price': new_booking.total_price,
        'booking_status': new_booking.booking_status
    }), 201


@booking_bp.route('/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    current_user_id = int(get_jwt_identity())  # Convert string to int for consistency
    bookings = Booking.query.filter_by(user_id=current_user_id).all()
    
    bookings_list = []
    for booking in bookings:
        bookings_list.append({
            "id": booking.id,
            "listing_id": booking.listing_id,
            "check_in": booking.check_in.isoformat() if booking.check_in else None,
            "check_out": booking.check_out.isoformat() if booking.check_out else None,
            "total_price": booking.total_price,
            "booking_status": booking.booking_status
        })
    
    return jsonify(bookings_list), 200


@booking_bp.route('/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    current_user_id = int(get_jwt_identity())  # Convert to int for consistency
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    # Ensure user can only cancel their own bookings
    if booking.user_id != current_user_id:
        return jsonify({"error": "Unauthorized to cancel this booking"}), 403

    # Check if booking can be cancelled based on status
    if booking.booking_status.lower() == 'confirmed':
        return jsonify({"error": "Cannot cancel confirmed booking"}), 400
    
    if booking.booking_status.lower() == 'completed':
        return jsonify({"error": "Cannot cancel completed booking"}), 400
    
    if booking.booking_status.lower() == 'cancelled':
        return jsonify({"error": "Booking is already cancelled"}), 400

    # Only allow cancellation of pending bookings
    if booking.booking_status.lower() != 'pending':
        return jsonify({"error": f"Cannot cancel booking with status: {booking.booking_status}"}), 400

    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking cancelled successfully!"}), 200

# Check availability for a listing
@booking_bp.route('/listings/<int:listing_id>/availability', methods=['POST'])
def check_availability(listing_id):
    data = request.get_json()
    check_in = data.get('check_in')
    check_out = data.get('check_out')
    if not check_in or not check_out:
        return jsonify({'error': 'check_in and check_out dates required'}), 400

    # Query for overlapping bookings
    overlapping = Booking.query.filter(
        Booking.listing_id == listing_id,
        Booking.check_out > check_in,
        Booking.check_in < check_out
    ).first()

    if overlapping:
        return jsonify({'available': False, 'error': 'Listing is not available for the selected dates.'}), 200
    else:
        return jsonify({'available': True, 'success': 'Listing is available for the selected dates.'}), 200
