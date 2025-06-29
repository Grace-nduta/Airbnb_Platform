# AirBNB_Booking_Backend

This is the backend server for the AirBNB booking application.

## Features

### User/Guest Features:
- Search listings by price range
- Favorite listings
- Leave reviews for listings
- Book listings
- View booking history

### Host Features:
- Add new listings
- View and manage bookings
- Approve/reject booking requests
- Track earnings
- Edit and delete listings
- Update listing status

### Admin Features:
- Analytics dashboard
- User role management (Guest/Host/Admin)
- Listing verification and status management
- System-wide earnings tracking

## Setup

1. Install dependencies:
```bash```
pipenv install
pipenv shell
```

2. Initialize database:
```bash
flask db init
flask db upgrade head
```

3. Run the server:
```bash```
python app.py
```

The server will run on `http://localhost:5555`

## API Endpoints

### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/logout` - User logout

### Listings
- GET `/listings` - Get all listings (supports price range filtering)
- GET `/listings/<id>` - Get specific listing
- POST `/host/listings` - Create new listing (Host only)
- PUT `/host/<listing_id>` - Update listing (Host only)
- DELETE `/host/<listing_id>` - Delete listing (Host only)

### Bookings
- GET `/bookings` - Get all bookings
- POST `/bookings` - Create new booking
- DELETE `/bookings/<id>` - Cancel booking
- PATCH `/host/bookings/<id>/approve` - Approve booking (Host only)
- PATCH `/host/bookings/<id>/reject` - Reject booking (Host only)

### Favorites
- GET `/users/<user_id>/favorites` - Get user favorites
- POST `/favorites` - Add to favorites
- DELETE `/favorites/<id>` - Remove from favorites

### Reviews
- GET `/reviews` - Get all reviews
- POST `/reviews` - Create review
- DELETE `/reviews/<id>` - Delete review

### Admin
- GET `/admin/users` - Get all users
- PATCH `/admin/users/<id>/role` - Update user role
- GET `/admin/analytics` - Get system analytics
- PATCH `/admin/listings/<id>/status` - Update listing status

### Host
- GET `/host/listings` - Get host's listings
- GET `/host/bookings` - Get bookings for host's listings
- GET `/host/total-earnings` - Get total earnings
