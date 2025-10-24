// src/pages/EditTour.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './EditTour.scss';

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    difficulty: 'Easy',
    price: '',
    maxParticipants: '',
    slotsPerDay: '12', // ← NEW FIELD
    availableDates: '',
    features: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await API.get(`/tours/${id}`);
        const tour = res.data;
        
        setFormData({
          title: tour.title || '',
          description: tour.description || '',
          location: tour.location || '',
          duration: tour.duration || '',
          difficulty: tour.difficulty || 'Easy',
          price: tour.price || '',
          maxParticipants: tour.maxParticipants || 1,
          slotsPerDay: tour.slotsPerDay || 12, // ← LOAD FROM API
          availableDates: tour.availableDates 
            ? tour.availableDates.map(d => new Date(d).toISOString().split('T')[0]).join(', ')
            : '',
          features: tour.features ? tour.features.join(', ') : ''
        });
        
        if (tour.image) {
          setImagePreview(`http://localhost:5000${tour.image}`);
        }
      } catch (err) {
        console.error('Fetch tour error:', err);
        alert('Failed to load tour details');
        navigate('/tours');
      }
    };
    fetchTour();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tourData = new FormData();
      
      // Append all fields (including slotsPerDay)
      Object.keys(formData).forEach(key => {
        if (key === 'availableDates') {
          const dates = formData[key]
            .split(',')
            .map(d => d.trim())
            .filter(d => d);
          tourData.append(key, dates.join(','));
        } else if (key === 'features') {
          const features = formData[key]
            .split(',')
            .map(f => f.trim())
            .filter(f => f);
          tourData.append(key, features.join(','));
        } else {
          tourData.append(key, formData[key]);
        }
      });
      
      if (image) {
        tourData.append('image', image);
      }

      await API.put(`/tours/${id}`, tourData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('✅ Tour updated successfully!');
      navigate(`/tour/${id}`); // ← Navigate to detail page
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.message || 'Failed to update tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-tour-container">
      <div className="edit-header">
        <h2>Edit Kayak Tour</h2>
        <p>Update tour details including time slot capacity</p>
      </div>
      
      <form onSubmit={handleSubmit} className="edit-tour-form">
        {/* Basic Info */}
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Max Participants *</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Slots Per Day *</label>
            <input
              type="number"
              name="slotsPerDay"
              value={formData.slotsPerDay}
              onChange={handleChange}
              required
              min="1"
              max="24"
              placeholder="e.g., 12"
            />
            <small className="help-text">Max bookings allowed per day (6AM–6PM = 12 slots)</small>
          </div>
        </div>

        {/* Duration & Difficulty */}
        <div className="form-row">
          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g., 2.5 hours"
            />
          </div>
          <div className="form-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
        </div>

        {/* Dates & Features */}
        <div className="form-row">
          <div className="form-group full-width">
            <label>Available Dates *</label>
            <input
              type="text"
              name="availableDates"
              value={formData.availableDates}
              onChange={handleChange}
              required
              placeholder="YYYY-MM-DD, YYYY-MM-DD (comma separated)"
            />
            <small className="help-text">Example: 2025-10-25, 2025-10-26</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Features</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Life Jacket, Guide, Photos (comma separated)"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-row">
          <div className="form-group full-width">
            <label>Tour Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Tour preview" />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-row">
          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="btn-cancel"
          >
            ← Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : '✅ Save Tour'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTour;