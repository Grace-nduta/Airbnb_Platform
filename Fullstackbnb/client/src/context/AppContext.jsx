import React from 'react';
import { AuthProvider } from "./AuthContext.jsx";
import { ListingsProvider } from "./ListingContext.jsx";
import { BookingsProvider } from "./BookingsContext.jsx";
import { FavoritesProvider } from "./FavoritesContext.jsx";
import { AdminProvider } from "./AdminContext.jsx";


export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ListingsProvider>
        <BookingsProvider>
          <FavoritesProvider>
            <AdminProvider>
              {children}
            </AdminProvider>
          </FavoritesProvider>
        </BookingsProvider>
      </ListingsProvider>
    </AuthProvider>
  );
};