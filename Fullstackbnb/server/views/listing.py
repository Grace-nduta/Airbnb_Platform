from flask import Blueprint, request, jsonify
from models import Listing, db, User
from flask_jwt_extended import jwt_required, get_jwt_identity


listing_bp = Blueprint('listing', __name__)


@listing_bp.route('/listings', methods=['GET'])
def get_all_listings():
    listings = Listing.query.all()
    result = []
    for listing in listings:
        result.append({
            "id": listing.id,
            "title": listing.title,
            "location": listing.location,
            "description": listing.description,
            "price_per_night": listing.price_per_night,
            "amenities": listing.amenities,
            "image_url":listing.image_url,
            "status": listing.status
        })
    return jsonify(result), 200


@listing_bp.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if listing:
        return jsonify({
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price_per_night": listing.price_per_night,
            "amenities": listing.amenities,
            "location": listing.location,
            "image_url": listing.image_url,
            "status": listing.status

        })
    return jsonify({"error": "Listing not found"}), 404

@listing_bp.route('/listings/<int:listing_id>/image_url', methods=['GET'])
def get_listing_image_url(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing or not listing.image_url:
        return jsonify({"error": "Image URL not found"}), 404
    return jsonify({"image_url": listing.image_url}), 200


@listing_bp.route('/listings', methods=['GET'])
def get_listings():
    title = request.args.get('title')
    location = request.args.get('location')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    query = Listing.query
    if title:
        query = query.filter(Listing.title.like(f'%{title}%'))
    if location:
        query = query.filter(Listing.location.like(f'%{location}%'))
    if min_price:
        query = query.filter(Listing.price_per_night >= min_price)

    if max_price:
        query = query.filter(Listing.price_per_night <= max_price)

    listings = query.all()
    return jsonify([listing.to_dict() for listing in listings])

@listing_bp.route('/listings/<int:listing_id>/status', methods=['GET'])
@jwt_required()
def get_listing_status(listing_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != 'Admin':
        return jsonify({"error": "Admin access required"}), 403

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    return jsonify({"id": listing.id, "status": listing.status}), 200

@listing_bp.route('/listings/<int:listing_id>/status', methods=['PATCH'])
@jwt_required()
def patch_listing_status(listing_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != 'Admin':
        return jsonify({"error": "Admin access required"}), 403

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    data = request.get_json()
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Missing 'status' in request body"}), 400

    listing.status = new_status
    db.session.commit()

    return jsonify({"id": listing.id, "status": listing.status}), 200

