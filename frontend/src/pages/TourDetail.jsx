// src/pages/TourDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './TourDetails.scss';

const TourDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await API.get(`/tours/${id}`);
        setTour(res.data);
        if (res.data.availableDates?.length > 0) {
          const firstDate = new Date(res.data.availableDates[0]).toISOString().split('T')[0];
          setSelectedDate(firstDate);
        }
      } catch (err) {
        console.error('Fetch tour error:', err);
        alert('Failed to load tour details.');
        navigate('/tours');
      }
    };
    fetchTour();
  }, [id, navigate]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate || !id) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await API.get(`/tours/${id}/available-slots`, {
          params: { date: selectedDate }
        });
        setAvailableSlots(res.data.availableSlots || []);
        setSelectedSlot(res.data.availableSlots?.[0] || '');
      } catch (err) {
        console.error('Failed to load time slots:', err);
        setAvailableSlots([]);
        setSelectedSlot('');
        alert('Could not load available time slots. Please try another date.');
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, id]);

  const handleBook = () => {
    if (!selectedSlot) {
      alert('Please select a time slot to book.');
      return;
    }
    navigate(`/booking/${id}`, { 
      state: { 
        date: selectedDate, 
        slotTime: selectedSlot,
        participants 
      } 
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) return;
    
    setLoading(true);
    try {
      await API.delete(`/tours/${id}`);
      alert('✅ Tour deleted successfully!');
      navigate('/tours');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        alert('❌ You do not have permission to delete this tour.');
      } else if (err.response?.status === 404) {
        alert('Tour not found.');
        navigate('/tours');
      } else {
        alert(err.response?.data?.message || 'Failed to delete tour.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-tour/${id}`);
  };

  if (!tour) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tour details...</p>
      </div>
    );
  }

  return (
    <div className="tour-detail">
      <div className="tour-header">
        <h1 className="tour-title">{tour.title}</h1>
        <div className="tour-location">📍 {tour.location}</div>
        
        {user?.role === 'admin' && (
          <div className="admin-actions">
            <button onClick={handleEdit} className="edit-tour-btn">
              ✏️ Edit Tour
            </button>
            <button 
              onClick={handleDelete}
              className="delete-tour-btn"
              disabled={loading}
            >
              {loading ? 'Deleting...' : '🗑️ Delete Tour'}
            </button>
          </div>
        )}
      </div>

      <div className="tour-content">
        <div className="tour-image-card">
          {tour.image ? (
            <img 
              src={`http://localhost:5000${tour.image}`} 
              alt={tour.title}
              className="tour-image"
            />
          ) : (
            <div className="image-placeholder">🚤 Tour Image</div>
          )}
          
          <div className="image-captions">
            <div className="caption-section">
              <h4>📖 About This Experience</h4>
              <p>{tour.description || "Discover the beauty of nature with this amazing kayaking experience."}</p>
            </div>
            
            <div className="caption-section">
              <h4>⭐ What's Included</h4>
              <ul className="features-list">
                <li>Professional kayaking equipment</li>
                <li>Safety briefing and instructions</li>
                <li>Experienced tour guide</li>
                <li>Safety gear (life jackets)</li>
                <li>Basic photography during the tour</li>
              </ul>
            </div>
            
            <div className="caption-section">
              <h4>🎯 What to Bring</h4>
              <ul className="features-list">
                <li>Comfortable clothing that can get wet</li>
                <li>Sun protection (hat, sunscreen)</li>
                <li>Water shoes or sandals</li>
                <li>Waterproof bag for personal items</li>
                <li>Drinking water</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="tour-info-card">
          <div className="info-section details-section">
            <h3>ℹ️ Tour Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="icon">⏱️</div>
                <div className="detail-content">
                  <span className="label">Duration</span>
                  <span className="value">{tour.duration}</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="icon">👥</div>
                <div className="detail-content">
                  <span className="label">Max Participants</span>
                  <span className="value">{tour.maxParticipants} people</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="icon">💰</div>
                <div className="detail-content">
                  <span className="label">Price</span>
                  <span className="value">₹{tour.price} per person</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="icon">📅</div>
                <div className="detail-content">
                  <span className="label">Daily Slots</span>
                  <span className="value">{tour.slotsPerDay} time slots</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section booking-section">
            <h3>🎯 Book This Tour</h3>
            <div className="booking-controls">
              
              <div className="control-group">
                <label>Select Date</label>
                <select 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-selector"
                >
                  {tour.availableDates.map(date => (
                    <option key={date} value={new Date(date).toISOString().split('T')[0]}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Select Time Slot</label>
                {slotsLoading ? (
                  <div className="slot-loading">Loading available slots...</div>
                ) : availableSlots.length > 0 ? (
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="slot-selector"
                  >
                    <option value="">Choose a time</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="no-slots">No slots available on this date</div>
                )}
              </div>

              <div className="control-group">
                <label>Number of Participants</label>
                <div className="participants-control">
                  <input
                    type="number"
                    min="1"
                    max={tour.maxParticipants}
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    className="participants-input"
                  />
                  <span>person(s)</span>
                </div>
              </div>

              <div className="price-summary">
                <div className="total-price">₹{tour.price * participants}</div>
                <div className="price-note">Total amount to pay</div>
              </div>

              <button 
                onClick={handleBook} 
                disabled={!selectedSlot}
                className="book-button"
              >
                🚀 Book Now - ₹{tour.price * participants}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;