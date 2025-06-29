import React, { createContext, useContext, useReducer } from 'react';

import {API_BASE} from "../config.json"

const ListingsContext = createContext();

const listingsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_LISTINGS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_LISTINGS_SUCCESS':
      return { 
        ...state, 
        listings: action.payload, 
        loading: false 
      };
    case 'FETCH_LISTINGS_FAILURE':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'ADD_LISTING':
      return { 
        ...state, 
        listings: [...state.listings, action.payload] 
      };
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map(listing => 
          listing.id === action.payload.id ? action.payload : listing
        )
      };
    case 'DELETE_LISTING':
      return {
        ...state,
        listings: state.listings.filter(listing => listing.id !== action.payload)
      };
    default:
      return state;
  }
};

export const ListingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingsReducer, {
    listings: [],
    loading: false,
    error: null,
    searchFilters: {
      location: '',
      minPrice: '',
      maxPrice: '',
      title: ''
    }
  });

  // Fetch all listings (with filters)
  const fetchListings = async (filters = {}) => {
    dispatch({ type: 'FETCH_LISTINGS_START' });
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      dispatch({ type: 'FETCH_LISTINGS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_LISTINGS_FAILURE', payload: error.message });
    }
  };

  // Fetch listings for a specific host
  const fetchHostListings = async (hostId) => {
    dispatch({ type: 'FETCH_LISTINGS_START' });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings/host/${hostId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch host listings');
      const data = await response.json();
      dispatch({ type: 'FETCH_LISTINGS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_LISTINGS_FAILURE', payload: error.message });
    }
  };


  // Verify a listing (admin)
  const verifyListing = async (listingId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings/${listingId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to verify listing');
      const updatedListing = await response.json();
      dispatch({ type: 'UPDATE_LISTING', payload: updatedListing });
      return updatedListing;
    } catch (error) {
      console.error('Verify listing error:', error);
      throw error;
    }
  };

  // Create a listing
  const createListing = async (listingData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(listingData)
      });
      if (!response.ok) throw new Error('Failed to create listing');
      const newListing = await response.json();
      dispatch({ type: 'ADD_LISTING', payload: newListing });
      return newListing;
    } catch (error) {
      console.error('Create listing error:', error);
      throw error;
    }
  };

  // Update a listing
  const updateListing = async (id, listingData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(listingData)
      });
      if (!response.ok) throw new Error('Failed to update listing');
      const updatedListing = await response.json();
      dispatch({ type: 'UPDATE_LISTING', payload: updatedListing });
      return updatedListing;
    } catch (error) {
      console.error('Update listing error:', error);
      throw error;
    }
  };

  // Delete a listing
  const deleteListing = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete listing');
      dispatch({ type: 'DELETE_LISTING', payload: id });
    } catch (error) {
      console.error('Delete listing error:', error);
      throw error;
    }
  };

  const setSearchFilters = (filters) => {
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: filters });
  };

  return (
    <ListingsContext.Provider value={{
      ...state,
      fetchListings,
      verifyListing,
      createListing,
      updateListing,
      deleteListing,
      setSearchFilters
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within ListingsProvider');
  }
  return context;
};