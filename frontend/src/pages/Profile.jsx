import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Profile.scss';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await API.put(`/bookings/${id}/cancel`);
      
      setBookings(prev => 
        prev.map(booking => 
          booking._id.toString() === id.toString() 
            ? res.data.booking 
            : booking
        )
      );
      
      alert('Booking cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="user-info">
          <div className="info-item">
            <p>
              <strong>Name</strong>
              <span>{user.name}</span>
            </p>
          </div>
          <div className="info-item">
            <p>
              <strong>Email</strong>
              <span>{user.email}</span>
            </p>
          </div>
          <div className="info-item">
            <p>
              <strong>Role</strong>
              <span className="role-badge">{user.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <section className="bookings-section">
        <h3>My Bookings</h3>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            Loading your bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h4>No Bookings Yet</h4>
              <p>You haven't made any bookings yet. Start your kayaking adventure today!</p>
              <Link to="/tours" className="explore-btn">
                Explore Tours
              </Link>
            </div>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h4>{booking.tour?.title || 'Tour Not Available'}</h4>
                  <span className={`booking-status ${booking.status?.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="booking-details">
                  <div className="detail-item">
                    <p>
                      <strong>Date</strong>
                      <span>{new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </p>
                  </div>
                  <div className="detail-item">
                    <p>
                      <strong>Participants</strong>
                      <span>{booking.participants} person{booking.participants > 1 ? 's' : ''}</span>
                    </p>
                  </div>
                  <div className="detail-item">
                    <p>
                      <strong>Total Price</strong>
                      <span>₹{booking.totalPrice}</span>
                    </p>
                  </div>
                  <div className="detail-item">
                    <p>
                      <strong>Booking ID</strong>
                      <span className="booking-id">#{booking._id.slice(-8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                
                <div className="booking-actions">
                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="cancel-btn"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                  {booking.tour && (
                    <Link 
                      to={`/tours/${booking.tour._id}`} 
                      className="view-details-btn"
                    >
                      View Tour Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;