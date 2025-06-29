import React, { createContext, useContext, useReducer } from 'react';

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FAVORITES_SUCCESS':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload] 
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload)
      };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: []
  });

  const fetchFavorites = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favorites/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch favorites');
      
      const data = await response.json();
      dispatch({ type: 'FETCH_FAVORITES_SUCCESS', payload: data });
    } catch (error) {
      console.error('Fetch favorites error:', error);
    }
  };

  const addToFavorites = async (listingId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ listingId })
      });
      
      if (!response.ok) throw new Error('Failed to add to favorites');
      
      const newFavorite = await response.json();
      dispatch({ type: 'ADD_FAVORITE', payload: newFavorite });
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to remove from favorites');
      
      dispatch({ type: 'REMOVE_FAVORITE', payload: favoriteId });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      throw error;
    }
  };

  return (
    <FavoritesContext.Provider value={{
      ...state,
      fetchFavorites,
      addToFavorites,
      removeFromFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};