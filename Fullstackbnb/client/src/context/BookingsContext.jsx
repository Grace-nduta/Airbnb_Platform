import React, { createContext, useContext, useReducer } from 'react';

import {API_BASE} from "../config.json"

const BookingsContext = createContext();

const bookingsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_BOOKINGS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_BOOKINGS_SUCCESS':
      return { 
        ...state, 
        bookings: action.payload, 
        loading: false 
      };
    case 'FETCH_BOOKINGS_FAILURE':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    case 'ADD_BOOKING':
      return { 
        ...state, 
        bookings: [...state.bookings, action.payload] 
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        )
      };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking => 
          booking.id === action.payload 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      };
    default:
      return state;
  }
};

export const BookingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingsReducer, {
    bookings: [],
    loading: false,
    error: null
  });

  // Fetch bookings for a user
  const fetchBookings = async (userId) => {
    dispatch({ type: 'FETCH_BOOKINGS_START' });
    try {
      const response = await fetch(`${API_BASE}/api/bookings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      dispatch({ type: 'FETCH_BOOKINGS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_BOOKINGS_FAILURE', payload: error.message });
    }
  };

  // Fetch all bookings for a listing (host)
  const fetchBookingsForListing = async (listingId) => {
    dispatch({ type: 'FETCH_BOOKINGS_START' });
    try {
      const response = await fetch(`${API_BASE}/api/bookings/listing/${listingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings for listing');
      const data = await response.json();
      dispatch({ type: 'FETCH_BOOKINGS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_BOOKINGS_FAILURE', payload: error.message });
    }
  };

  // Fetch all bookings (admin)
  const fetchAllBookings = async (page = 1, pageSize = 20) => {
    dispatch({ type: 'FETCH_BOOKINGS_START' });
    try {
      const response = await fetch(`${API_BASE}/api/bookings?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch all bookings');
      const data = await response.json();
      dispatch({ type: 'FETCH_BOOKINGS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_BOOKINGS_FAILURE', payload: error.message });
    }
  };

  // Create a booking
  const createBooking = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to create booking');
      const newBooking = await response.json();
      dispatch({ type: 'ADD_BOOKING', payload: newBooking });
      return newBooking;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  };

  // Update a booking (date, guest count, etc.)
  const updateBooking = async (bookingId, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) throw new Error('Failed to update booking');
      const updatedBooking = await response.json();
      dispatch({ type: 'UPDATE_BOOKING', payload: updatedBooking });
      return updatedBooking;
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      dispatch({ type: 'CANCEL_BOOKING', payload: bookingId });
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  };

  // Check availability for a listing
  const checkAvailability = async (listingId, checkIn, checkOut) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/listings/${listingId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
      );
      if (!response.ok) throw new Error('Failed to check availability');
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Check availability error:', error);
      throw error;
    }
  };

  return (
    <BookingsContext.Provider value={{
      ...state,
      fetchBookings,
      fetchBookingsForListing,
      fetchAllBookings,
      createBooking,
      updateBooking,
      cancelBooking,
      checkAvailability
    }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingsProvider');
  }
  return context;
};