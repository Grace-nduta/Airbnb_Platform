from flask import jsonify, request, Blueprint
from models import Review, Listing, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
review_bp = Blueprint('review', __name__)


@review_bp.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    data = request.json
    user_id = int(get_jwt_identity())  # Convert to int for consistency
    
    # Check if user already reviewed this listing
    existing_review = Review.query.filter_by(user_id=user_id, listing_id=data['listing_id']).first()
    if existing_review:
        return jsonify({"error": "You have already reviewed this listing"}), 400
    
    new_review = Review(
        user_id=user_id,
        listing_id=data['listing_id'],
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    
    try:
        db.session.add(new_review)
        db.session.commit()
        return jsonify({"message": "Review added successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add review"}), 500


@review_bp.route('/reviews/user', methods=['GET'])
@jwt_required()
def get_user_reviews():
    user_id = int(get_jwt_identity())  # Convert to int for consistency
    reviews = Review.query.filter_by(user_id=user_id).all()
    
    reviews_list = []
    for review in reviews:
        listing = Listing.query.get(review.listing_id)
        reviews_list.append({
            "id": review.id,
            "user_id": review.user_id,
            "listing_id": review.listing_id,
            "listing_title": listing.title if listing else 'Unknown Listing',
            "rating": review.rating,
            "comment": review.comment,
            "content": review.comment,  # Alias for backward compatibility
            "created_at": review.created_at.isoformat() if review.created_at else None
        })
    return jsonify(reviews_list), 200


@review_bp.route('/reviews/listing/<int:listing_id>', methods=['GET'])
def get_listing_reviews(listing_id):
    reviews = Review.query.filter_by(listing_id=listing_id).all()
    
    reviews_list = []
    for review in reviews:
        user = User.query.get(review.user_id)
        reviews_list.append({
            "id": review.id,
            "user_id": review.user_id,
            "user_name": user.username if user else 'Anonymous',
            "listing_id": review.listing_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at.isoformat() if review.created_at else None
        })
    return jsonify(reviews_list), 200


@review_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    user_id = int(get_jwt_identity())  # Convert to int for consistency
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'error': "Review not found"}), 404
    if review.user_id != user_id:
        return jsonify({'error': "You are not authorized to delete this review"}), 403
    
    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete review"}), 500


@review_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    reviews_list = []
    for review in reviews:
        user = User.query.get(review.user_id)
        listing = Listing.query.get(review.listing_id)
        reviews_list.append({
            "id": review.id,
            "user_id": review.user_id,
            "user_name": user.username if user else 'Anonymous',
            "listing_id": review.listing_id,
            "listing_title": listing.title if listing else 'Unknown Listing',
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at.isoformat() if review.created_at else None
        })
    return jsonify(reviews_list), 200

