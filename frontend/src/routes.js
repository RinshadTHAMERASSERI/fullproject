import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import BookingForm from './pages/BookingForm';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AddTour from './pages/AddTour';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Contact from './pages/Contact';
import Aboute from './pages/Aboute';
import EditTour from './pages/EditTour';
import AdminBookings from './pages/AdminBookings';
import BookingConfirmation from './pages/BookingConfirmation';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetail />} />
     <Route 
  path="/booking/:tourId" 
  element={<ProtectedRoute><BookingForm /></ProtectedRoute>} 
/>
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-tour" element={<AdminRoute><AddTour /></AdminRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/aboute" element={<ProtectedRoute><Aboute /></ProtectedRoute>} />
      <Route path="/edit-tour/:id" element={<EditTour />} />
      <Route path="/booking-page" element={<AdminBookings />} />
      <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
    </Routes>
  );
};

export default AppRoutes;