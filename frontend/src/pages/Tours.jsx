// src/pages/Tours.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import TourCard from '../components/TourCard';
import { AuthContext } from '../context/AuthContext';
import './Tours.scss';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await API.get('/tours');
        setTours(res.data);
      } catch (err) {
        console.error('Failed to fetch tours:', err);
        alert('Failed to load tours. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleEdit = (tourId) => {
    navigate(`/edit-tour/${tourId}`);
  };

  const handleDelete = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(tourId);
    try {
      await API.delete(`/tours/${tourId}`);
      setTours(prev => prev.filter(tour => tour._id !== tourId));
      alert('✅ Tour deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        alert('❌ You do not have permission to delete tours.');
      } else if (err.response?.status === 404) {
        alert('Tour not found.');
      } else {
        alert(err.response?.data?.message || 'Failed to delete tour. Please try again.');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleAddTour = () => {
    navigate('/add-tour');
  };

  const handleBookTour = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  if (loading) {
    return (
      <div className="tours-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h2 className="tours-title">Kayak Tours</h2>
        
        {user?.role === 'admin' && (
          <button 
            onClick={handleAddTour}
            className="add-tour-btn"
            aria-label="Add new tour"
          >
            + Add New Tour
          </button>
        )}
      </div>

      {tours.length === 0 ? (
        <div className="no-tours">
          <p>No kayak tours available at the moment.</p>
          {user?.role === 'admin' && (
            <button 
              onClick={handleAddTour}
              className="add-tour-btn primary"
            >
              + Create Your First Tour
            </button>
          )}
        </div>
      ) : (
        <div className="tours-grid">
          {tours.map(tour => (
            <div key={tour._id} className="tour-card-wrapper">
              <TourCard 
                tour={tour} 
                onBook={() => handleBookTour(tour._id)}
                showSlotInfo={true} // ← Pass prop to show slot info
              />
              
              {/* Admin Actions Overlay */}
              {user?.role === 'admin' && (
                <div className="admin-actions-overlay">
                  <button 
                    onClick={() => handleEdit(tour._id)}
                    className="edit-btn"
                    disabled={deleteLoading === tour._id}
                    aria-label={`Edit ${tour.title}`}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(tour._id)}
                    className="delete-btn"
                    disabled={deleteLoading === tour._id}
                    aria-label={`Delete ${tour.title}`}
                  >
                    {deleteLoading === tour._id ? '⏳ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tours;