from flask import Blueprint, jsonify, request
from models import Booking, Listing, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

host_blueprint = Blueprint('host', __name__)


def require_host_role():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user or user.role != 'host':
        return None
    return user


# ========== Create listings =========
@host_blueprint.route('/host/listings', methods=['POST'])
@jwt_required()
def create_listing():
    data = request.json

    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403

    # Check required fields - make amenities and image_url optional
    required_fields = ['title', 'description', 'price_per_night', 'location']
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return jsonify({"error": f"{field} is required"}), 400

    # Optional fields with defaults
    amenities = data.get('amenities', '')
    image_url = data.get('image_url', '')
    
    # Convert amenities to string if it's a list
    if isinstance(amenities, list):
        amenities = ', '.join(amenities)

    try:
        new_listing = Listing(
            user_id=user.id,
            title=str(data['title']).strip(),
            description=str(data['description']).strip(),
            location=str(data['location']).strip(),
            price_per_night=float(data['price_per_night']),
            amenities=str(amenities).strip(),
            image_url=str(image_url).strip(),
            status='pending',  # All new listings start as pending for admin approval
            created_at=datetime.utcnow()
        )

        db.session.add(new_listing)
        db.session.commit()
        
        return jsonify({
            "message": "Listing created successfully! It will be visible once approved by admin.",
            "listing": {
                "id": new_listing.id,
                "user_id": new_listing.user_id,
                "title": new_listing.title,
                "description": new_listing.description,
                "location": new_listing.location,
                "price_per_night": new_listing.price_per_night,
                "amenities": new_listing.amenities,
                "image_url": new_listing.image_url,
                "status": new_listing.status,
                "created_at": new_listing.created_at.isoformat()
            }
        }), 201
        
    except ValueError as e:
        return jsonify({"error": "Invalid price format"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save listing", "details": str(e)}), 500


# ========== update bookings =========
@host_blueprint.route('/host/bookings/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
        
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    if booking.listing.user_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    booking.booking_status = data.get('booking_status', booking.booking_status)
    db.session.commit()
    return jsonify({"success": "Booking updated successfully!"}), 200

# ========== Get Bookings made on their listings =========
@host_blueprint.route('/host/bookings', methods=['GET'])
@jwt_required()
def get_host_bookings():
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
        
    listings = Listing.query.filter_by(user_id=user.id).all()
    listing_ids = [listing.id for listing in listings]
    bookings = Booking.query.filter(Booking.listing_id.in_(listing_ids)).all()
    
    booking_list = []
    for booking in bookings:
        booking_data = {
            'booking_id': booking.id,
            'listing_id': booking.listing_id,
            'listing_title': booking.listing.title if booking.listing else 'Unknown',
            'guest_id': booking.user_id,
            'guest_name': booking.guest.username if booking.guest else 'Unknown',
            'check_in': booking.check_in.isoformat() if booking.check_in else None,
            'check_out': booking.check_out.isoformat() if booking.check_out else None,
            'total_price': booking.total_price,
            'booking_status': booking.booking_status,
            'created_at': booking.created_at.isoformat() if booking.created_at else None
        }
        booking_list.append(booking_data)
    
    return jsonify(booking_list), 200

#  ========== Track Total Earnings =========
@host_blueprint.route('/host/total-earnings', methods=['GET'])
@jwt_required()
def track_total_earnings():
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
        
    listings = Listing.query.filter_by(user_id=user.id).all()
    listing_ids = [listing.id for listing in listings]
    bookings = Booking.query.filter(Booking.listing_id.in_(
        listing_ids), Booking.booking_status == 'confirmed').all()
    total_earnings = sum(booking.total_price for booking in bookings)
    return jsonify({'total_earnings': total_earnings}), 200


# ========== Edit Listings =========
@host_blueprint.route('/host/<int:listing_id>', methods=['PUT'])
@jwt_required()
def edit_listing(listing_id):
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
    
    listing = Listing.query.get(listing_id)
    if not listing or listing.user_id != user.id:
        return jsonify({"error": "Listing not found or unauthorized"}), 404
    
    data = request.json
    
    # Update fields
    listing.title = data.get('title', listing.title)
    listing.description = data.get('description', listing.description)
    listing.price_per_night = data.get('price_per_night', listing.price_per_night)
    listing.amenities = data.get('amenities', listing.amenities)
    listing.image_url = data.get('image_url', listing.image_url)
    listing.location = data.get('location', listing.location)
    
    # If listing was active and updated, set to pending for re-approval
    if listing.status == 'active':
        listing.status = 'pending'
    
    try:
        db.session.commit()
        return jsonify({"message": "Listing updated successfully! It will be reviewed by admin."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update listing", "details": str(e)}), 500


# ========== Delete Listings =========
@host_blueprint.route('/host/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
        
    listing = Listing.query.get(listing_id)
    if not listing or listing.user_id != user.id:
        return jsonify({"error": "Listing not found or unauthorized"}), 404
    
    try:
        db.session.delete(listing)
        db.session.commit()
        return jsonify({"message": "Listing deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete listing", "details": str(e)}), 500

# ========== Get Host's Listings =========
@host_blueprint.route('/host/listings', methods=['GET'])
@jwt_required()
def get_host_listings():
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
    
    listings = Listing.query.filter_by(user_id=user.id).all()
    return jsonify([{
        'id': listing.id,
        'title': listing.title,
        'description': listing.description,
        'location': listing.location,
        'price_per_night': listing.price_per_night,
        'amenities': listing.amenities,
        'image_url': listing.image_url,
        'status': listing.status,
        'created_at': listing.created_at.isoformat() if listing.created_at else None,
        'average_rating': getattr(listing, 'average_rating', 0)
    } for listing in listings]), 200

# ========== Approve Booking =========
@host_blueprint.route('/host/bookings/<int:booking_id>/approve', methods=['PATCH'])
@jwt_required()
def approve_booking(booking_id):
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
    
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    # Check if the booking belongs to host's listing
    if booking.listing.user_id != user.id:
        return jsonify({"error": "Unauthorized - This booking is not for your listing"}), 403
    
    try:
        booking.booking_status = 'confirmed'
        db.session.commit()
        
        return jsonify({
            "message": "Booking approved successfully!",
            "booking": {
                "id": booking.id,
                "status": booking.booking_status
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to approve booking", "details": str(e)}), 500

# ========== Reject Booking =========
@host_blueprint.route('/host/bookings/<int:booking_id>/reject', methods=['PATCH'])
@jwt_required()
def reject_booking(booking_id):
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
    
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    # Check if the booking belongs to host's listing
    if booking.listing.user_id != user.id:
        return jsonify({"error": "Unauthorized - This booking is not for your listing"}), 403
    
    try:
        booking.booking_status = 'rejected'
        db.session.commit()
        
        return jsonify({
            "message": "Booking rejected successfully!",
            "booking": {
                "id": booking.id,
                "status": booking.booking_status
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to reject booking", "details": str(e)}), 500

# ========== Update Listing Status =========
@host_blueprint.route('/host/listings/<int:listing_id>/status', methods=['PATCH'])
@jwt_required()
def update_listing_status(listing_id):
    user = require_host_role()
    if not user:
        return jsonify({"error": "Host access required"}), 403
    
    listing = Listing.query.get(listing_id)
    if not listing or listing.user_id != user.id:
        return jsonify({"error": "Listing not found or unauthorized"}), 404
    
    data = request.json
    new_status = data.get('status')
    
    # Hosts can only toggle between active and inactive (not pending)
    if new_status not in ['active', 'inactive']:
        return jsonify({"error": "Invalid status. Hosts can only set active or inactive."}), 400
    
    # Only allow status change if listing was previously approved
    if listing.status == 'pending':
        return jsonify({"error": "Cannot change status of pending listing. Wait for admin approval."}), 400
    
    listing.status = new_status
    try:
        db.session.commit()
        return jsonify({"message": f"Listing status updated to {new_status}"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update status", "details": str(e)}), 500





