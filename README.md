# Airbnb Platform

A full-stack web application that replicates core Airbnb functionality, allowing users to browse, book, and manage property listings.

## Author

**Grace Kahare**

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Airbnb Platform is a comprehensive booking system that enables property owners to list their accommodations and travelers to discover and book unique places to stay. The application features a modern, responsive design with robust functionality for property management, booking systems, and user authentication.

## Features

### Guest Features
- Browse property listings with images, prices, and locations
- Advanced search and filtering by date, price, location, and amenities
- View detailed property information, reviews, and availability calendar
- User registration and authentication
- Book properties with date selection and payment integration
- View upcoming and past bookings
- Leave reviews and ratings after stays
- Save favorite properties to wishlist
- Cancel future bookings
- Edit and delete user profile
- Real-time availability checking to prevent double bookings

### Host Features
- Add new property listings with details, images, and pricing
- Manage existing listings (edit/delete)
- View and manage booking requests on properties
- Approve or reject guest booking requests
- Earnings dashboard with revenue tracking
- Booking insights and analytics for each listing

### Admin Features
- Verify and approve new property listings
- View comprehensive analytics (bookings, revenue, popular locations)
- Manage user roles and permissions
- Promote or demote users between roles

## Tech Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for styling

### Backend
- **Flask** - Python web framework
- **Flask-SQLAlchemy** - SQL toolkit and ORM for database operations

### Additional Technologies
- **SQLite/PostgreSQL** - Database for data persistence
- **JWT** - JSON Web Tokens for authentication
- **RESTful API** - API architecture for frontend-backend communication

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/gracekahare/Fullstackbnb.git
cd Fullstackbnb
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

6. Run the Flask development server:
```bash
python app.py
```

The backend will be available at `http://localhost:5555`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:5173/`

## Usage

### Running the Application

1. Start the backend server (Flask):
```bash
source venv/bin/activate
python app.py
```

2. In a new terminal, start the frontend server (React):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5555`

### Default Admin Account

After setting up the database, you can create an admin account:
```bash
flask create-admin --email admin@example.com --password admin123
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Listings Endpoints
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new property (Host only)
- `GET /api/listings/:id` - Get property details
- `PUT /api/listings/:id` - Update property (Host only)
- `DELETE /api/listings/:id` - Delete property (Host only)

### Booking Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Review Endpoints
- `POST /api/reviews` - Create review
- `GET /api/listings/:id/reviews` - Get property reviews

## Project Structure

```
Fullstackbnb/
├── server/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── config.py
│   ├── migrations/
│   ├── requirements.txt
│   └── run.py
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── README.md
└── .env.example
```

## User Roles

### Guest
- Can browse and search properties
- Can make bookings and leave reviews
- Can manage their profile and favorites

### Host
- All Guest permissions
- Can create and manage property listings
- Can view booking requests and earnings
- Access to host analytics dashboard

### Admin
- Full system access
- Can verify listings and manage users
- Access to comprehensive analytics
- Can promote/demote user roles


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Grace Kahare - [Your Email]

Project Link: [https://github.com/gracekahare/Fullstackbnb](https://github.com/gracekahare/Fullstackbnb)


