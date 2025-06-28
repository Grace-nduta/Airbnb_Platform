#!/usr/bin/env python3

from app import app
from models import db, User, Listing
from werkzeug.security import generate_password_hash

def add_sample_data():
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check if we already have listings
        if Listing.query.count() > 0:
            print("Listings already exist in the database!")
            listings = Listing.query.all()
            for listing in listings:
                print(f"- {listing.title} in {listing.location} - ${listing.price_per_night}/night")
            return
        
        # Create a sample host user if none exists
        host_user = User.query.filter_by(role='host').first()
        if not host_user:
            host_user = User(
                username='samplehost',
                email='host@example.com',
                password=generate_password_hash('password123'),
                role='host'
            )
            db.session.add(host_user)
            db.session.commit()
            print("Created sample host user")
        
        # Sample listings data
        sample_listings = [
            {
                'title': 'Cozy Downtown Apartment',
                'description': 'Beautiful 2-bedroom apartment in the heart of the city with amazing views and modern amenities.',
                'price_per_night': 120.0,
                'location': 'New York, NY',
                'image_url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
                'status': 'Active',
                'amenities': 'WiFi,Kitchen,Air Conditioning,TV,Washing Machine'
            },
            {
                'title': 'Beachfront Villa',
                'description': 'Stunning oceanfront villa with private beach access, perfect for a relaxing getaway.',
                'price_per_night': 350.0,
                'location': 'Miami, FL',
                'image_url': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500',
                'status': 'Active',
                'amenities': 'Pool,Beach Access,WiFi,Kitchen,Parking'
            },
            {
                'title': 'Mountain Cabin Retreat',
                'description': 'Rustic cabin nestled in the mountains, ideal for hiking enthusiasts and nature lovers.',
                'price_per_night': 95.0,
                'location': 'Aspen, CO',
                'image_url': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
                'status': 'Active',
                'amenities': 'Fireplace,WiFi,Kitchen,Hiking Trails,Scenic Views'
            },
            {
                'title': 'Modern Loft in Arts District',
                'description': 'Stylish loft with exposed brick walls and contemporary furnishings in the vibrant arts district.',
                'price_per_night': 180.0,
                'location': 'Los Angeles, CA',
                'image_url': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
                'status': 'Active',
                'amenities': 'WiFi,Kitchen,Air Conditioning,Gym Access,Rooftop Terrace'
            },
            {
                'title': 'Historic Brownstone',
                'description': 'Charming historic brownstone with original architecture and modern updates.',
                'price_per_night': 200.0,
                'location': 'Boston, MA',
                'image_url': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
                'status': 'Active',
                'amenities': 'WiFi,Kitchen,Heating,Historic Character,Garden'
            }
        ]
        
        # Add listings to database
        for listing_data in sample_listings:
            listing = Listing(
                user_id=host_user.id,
                title=listing_data['title'],
                description=listing_data['description'],
                price_per_night=listing_data['price_per_night'],
                location=listing_data['location'],
                image_url=listing_data['image_url'],
                status=listing_data['status'],
                amenities=listing_data['amenities']
            )
            db.session.add(listing)
        
        db.session.commit()
        print(f"✅ Successfully added {len(sample_listings)} sample listings to the database!")
        
        # Display what was added
        print("\nListings added:")
        for listing in sample_listings:
            print(f"- {listing['title']} in {listing['location']} - ${listing['price_per_night']}/night")

if __name__ == '__main__':
    add_sample_data() 