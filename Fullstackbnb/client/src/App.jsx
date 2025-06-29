import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './Pages/Home';
import ListingDetails from './Pages/ListingDetails';
import Signup from './Pages/Signup';
import UserDashboard from './Pages/UserDashboard';
import HostDashboard from './Pages/HostDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import Login from './Pages/Login';
import LogoutPage from './Pages/Logout';

// User Dashboard Tabs
import BookingsTab from './Pages/BookingsTab';
import FavoritesTab from './Pages/FavoritesTab';

// Host Dashboard Tabs
import ManageListings from './Pages/ManageListings';
import AddListingForm from './Pages/AddListingForm';

// Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import BrowseListings from "./Components/BrowseListings.jsx";
import ProfileSettings from "./Pages/ProfileSettings.jsx";
import ReviewsTab from "./Pages/ReviewsTab.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { AppProviders } from './context/AppContext.jsx';
import { BookingsProvider } from './context/BookingsContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { ListingsProvider } from './context/ListingContext.jsx';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <AuthProvider>
                <AdminProvider>
                    <AppProviders>
                        <BookingsProvider>
                            <FavoritesProvider>
                                <ListingsProvider>
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route path="/" element={<Home />} />
                                        <Route path="/listing/:id" element={<ListingDetails />} />
                                        <Route path="/signup" element={<Signup />} />
                                        <Route path="/logout" element={<LogoutPage />} />
                                        <Route path="/login" element={<Login />} />
                                        {/* User Dashboard */}
                                        <Route path="/user" element={<UserDashboard />}>
                                            <Route path="browse" element={<BrowseListings />} />
                                            <Route path="bookings" element={<BookingsTab />} />
                                            <Route path="profile" element={<ProfileSettings />} />
                                            <Route path="reviews" element={<ReviewsTab />} />
                                            <Route path="favorites" element={<FavoritesTab />} />
                                        </Route>

                                        {/* Host Dashboard */}
                                        <Route path="/host" element={<HostDashboard />}>
                                            <Route path="listings" element={<ManageListings />} />
                                            <Route path="add-listing" element={<AddListingForm />} />
                                            
                                        </Route>

                                        {/* Admin Panel */}
                                        <Route path="/admin" element={<AdminDashboard />} />
                                    </Routes>
                                </ListingsProvider>
                            </FavoritesProvider>
                        </BookingsProvider>
                    </AppProviders>
                </AdminProvider>
            </AuthProvider>
            <Footer />
        </BrowserRouter>
    );
}

export default App;