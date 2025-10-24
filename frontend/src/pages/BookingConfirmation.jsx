// src/components/BookingConfirmation.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import './BookingConfirmation.scss';

const BookingConfirmation = () => {
  const { user } = useContext(AuthContext);
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await API.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        setError('Failed to load booking details');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handlePayment = async () => {
    if (!booking) return;

    try {
      // Create Razorpay order
      const orderRes = await API.post('/bookings/create-order', {
        tourId: booking.tour._id,
        participants: booking.participants
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'Club Canova Kayak Tours',
        description: `Booking for ${booking.tour.title}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // Verify payment and confirm booking WITH slotTime
            const confirmRes = await API.post('/bookings/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tourId: booking.tour._id,
              date: booking.date,
              slotTime: booking.slotTime, // ← CRITICAL: Include slotTime
              participants: booking.participants
            });

            setBooking(confirmRes.data.booking);
            alert('✅ Booking confirmed successfully!');
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#0a5f75'
        }
      };

      if (window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        alert('Payment gateway is loading. Please try again.');
      }

      // Optional: Handle payment failure
      // razorpayInstance.on('payment.failed', ...)

    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmation-container">
      <div className="error-state">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <Link to="/tours" className="btn-primary">Browse Tours</Link>
      </div>
    </div>
    );
  }

  if (!booking) {
    return (
      <div className="confirmation-container">
        <div className="error-state">
          <h2>Booking Not Found</h2>
          <Link to="/tours" className="btn-primary">Browse Tours</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* Booking Header */}
        <div className="confirmation-header">
          <div className={`status-badge ${booking.status.toLowerCase()}`}>
            {booking.status}
          </div>
          <h1>Booking Confirmation</h1>
          <p>Booking ID: <strong>#{booking._id.slice(-8).toUpperCase()}</strong></p>
        </div>

        {/* Tour Details */}
        <div className="details-section">
          <h2>Tour Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Tour Name:</strong>
              <span>{booking.tour.title}</span>
            </div>
            <div className="detail-item">
              <strong>Date:</strong>
              <span>
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            {booking.slotTime && (
              <div className="detail-item">
                <strong>Time Slot:</strong>
                <span>⏰ {booking.slotTime}</span>
              </div>
            )}
            <div className="detail-item">
              <strong>Participants:</strong>
              <span>{booking.participants} person{booking.participants > 1 ? 's' : ''}</span>
            </div>
            <div className="detail-item">
              <strong>Duration:</strong>
              <span>{booking.tour.duration}</span>
            </div>
            <div className="detail-item">
              <strong>Location:</strong>
              <span>{booking.tour.location}</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="price-section">
          <h2>Price Details</h2>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Base Price ({booking.participants} × ₹{booking.tour.price})</span>
              <span>₹{booking.tour.price * booking.participants}</span>
            </div>
            <div className="price-row total">
              <strong>Total Amount</strong>
              <strong>₹{booking.totalPrice}</strong>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {booking.paymentStatus && (
          <div className="payment-section">
            <h2>Payment Status</h2>
            <div className={`payment-status ${booking.paymentStatus.toLowerCase()}`}>
              {booking.paymentStatus === 'Completed' ? 'Paid' : booking.paymentStatus}
            </div>
            {booking.paymentId && (
              <p className="payment-id">Payment ID: {booking.paymentId}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="action-section">
          {booking.status === 'Pending' ? (
            <div className="pending-actions">
              <button onClick={handlePayment} className="pay-now-btn">
                Pay Now - ₹{booking.totalPrice}
              </button>
              <p className="payment-note">
                Complete your payment to confirm the booking
              </p>
            </div>
          ) : booking.status === 'Confirmed' ? (
            <div className="confirmed-actions">
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Booking Confirmed!</h3>
                <p>Your kayaking adventure is all set. We've sent a confirmation email with all the details.</p>
              </div>
              <div className="action-buttons">
                <Link to="/profile" className="btn-secondary">
                  View My Bookings
                </Link>
                <Link to="/tours" className="btn-primary">
                  Book Another Tour
                </Link>
              </div>
            </div>
          ) : (
            <div className="cancelled-actions">
              <p>❌ This booking has been cancelled.</p>
              <Link to="/tours" className="btn-primary">
                Browse Available Tours
              </Link>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="notes-section">
          <h3>Important Information</h3>
          <ul>
            <li>📍 Please arrive 15 minutes before your <strong>{booking.slotTime}</strong> time slot</li>
            <li>🆔 Bring valid ID proof for verification</li>
            <li>👕 Wear comfortable clothing and shoes suitable for water activities</li>
            <li>💰 Cancellations 24 hours in advance receive full refund</li>
            <li>🌦️ In case of bad weather, tour may be rescheduled or refunded</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;