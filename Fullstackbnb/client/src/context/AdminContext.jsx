import React, { createContext, useContext, useReducer } from 'react';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ANALYTICS_SUCCESS':
      return { ...state, analytics: action.payload };
    case 'FETCH_ALL_USERS_SUCCESS':
      return { ...state, allUsers: action.payload };
    case 'UPDATE_USER_ROLE':
      return {
        ...state,
        allUsers: state.allUsers.map(user =>
          user.id === action.payload.userId
            ? { ...user, role: action.payload.role }
            : user
        )
      };
    case 'FETCH_ALL_LISTINGS_SUCCESS':
      return { ...state, allListings: action.payload };
    case 'DELETE_LISTING_SUCCESS':
      return {
        ...state,
        allListings: state.allListings.filter(listing => listing.id !== action.payload)
      };
    case 'VERIFY_LISTING_SUCCESS':
      return {
        ...state,
        allListings: state.allListings.map(listing =>
          listing.id === action.payload.id
            ? { ...listing, verified: action.payload.verified }
            : listing
        )
      };
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, {
    analytics: null,
    allUsers: [],
    allListings: []
  });

 

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      dispatch({ type: 'FETCH_ANALYTICS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      dispatch({ type: 'FETCH_ALL_USERS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) throw new Error('Failed to update user role');

      dispatch({ type: 'UPDATE_USER_ROLE', payload: { userId, role } });
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  };

  // --- NEW ADMIN LISTING FUNCTIONS ---

  const fetchAllListings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/listings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      dispatch({ type: 'FETCH_ALL_LISTINGS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Fetch listings error:', error);
    }
  };

  const deleteListing = async (listingId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete listing');
      dispatch({ type: 'DELETE_LISTING_SUCCESS', payload: listingId });
    } catch (error) {
      console.error('Delete listing error:', error);
      throw error;
    }
  };

  const verifyListing = async (listingId, verified = true) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/listings/${listingId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ verified })
      });
      if (!response.ok) throw new Error('Failed to verify listing');
      dispatch({ type: 'VERIFY_LISTING_SUCCESS', payload: { id: listingId, verified } });
    } catch (error) {
      console.error('Verify listing error:', error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{
      ...state,
      fetchAnalytics,
      fetchAllUsers,
      updateUserRole,
      fetchAllListings,
      deleteListing,
      verifyListing
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};