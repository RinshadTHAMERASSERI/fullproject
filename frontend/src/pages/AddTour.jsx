// src/components/AddTour.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './AddTour.scss';

const AddTour = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    difficulty: 'Easy',
    price: '',
    maxParticipants: '',
    slotsPerDay: '12', // Default: 12 hourly slots (6AM–6PM)
    availableDates: '',
    features: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.duration || parseFloat(formData.duration) <= 0) newErrors.duration = 'Valid duration is required';
    if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) < 1) newErrors.maxParticipants = 'At least 1 participant allowed';
    if (!formData.slotsPerDay || parseInt(formData.slotsPerDay) < 1 || parseInt(formData.slotsPerDay) > 24) {
      newErrors.slotsPerDay = 'Slots per day must be between 1 and 24';
    }

    // Validate availableDates format (YYYY-MM-DD, YYYY-MM-DD)
    if (formData.availableDates) {
      const dates = formData.availableDates.split(',').map(d => d.trim());
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const invalidDates = dates.filter(d => d && !dateRegex.test(d));
      if (invalidDates.length > 0) {
        newErrors.availableDates = 'Dates must be in YYYY-MM-DD format, separated by commas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (image) {
        submitData.append('image', image);
      }

      await API.post('/tours', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('✅ Tour created successfully!');
      navigate('/tours');
    } catch (error) {
      console.error('Error creating tour:', error);
      const msg = error.response?.data?.message || 'Failed to create tour. Please try again.';
      alert(msg);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-tour-container">
      <div className="add-tour-card">
        <h2>Add New Kayak Tour</h2>
        <p className="subtitle">Create a time-slot-based tour (e.g., 12 slots/day from 6AM–6PM)</p>

        <form onSubmit={handleSubmit} className="tour-form">
          {/* Row 1: Title & Location */}
          <div className="form-row">
            <div className="form-group">
              <label className="required">Tour Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Backwaters Explorer"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label className="required">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Elad Check Dam, Thrissur"
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
          </div>

          {/* Row 2: Duration, Difficulty & Slots Per Day */}
          <div className="form-row">
            <div className="form-group">
              <label className="required">Duration (hours) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0.5"
                step="0.5"
                placeholder="e.g., 2.5"
              />
              {errors.duration && <span className="error-text">{errors.duration}</span>}
            </div>
            <div className="form-group">
              <label className="required">Difficulty *</label>
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
            <div className="form-group">
              <label className="required">Slots Per Day *</label>
              <input
                type="number"
                name="slotsPerDay"
                value={formData.slotsPerDay}
                onChange={handleChange}
                min="1"
                max="24"
                placeholder="e.g., 12"
              />
              <small className="help-text">Max bookings/day (e.g., 12 = 6AM, 7AM, ..., 5PM)</small>
              {errors.slotsPerDay && <span className="error-text">{errors.slotsPerDay}</span>}
            </div>
          </div>

          {/* Row 3: Price & Max Participants */}
          <div className="form-row">
            <div className="form-group">
              <label className="required">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="e.g., 399"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="required">Max Participants per Booking *</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                placeholder="e.g., 4"
              />
              <small className="help-text">Max people in a single booking</small>
              {errors.maxParticipants && <span className="error-text">{errors.maxParticipants}</span>}
            </div>
          </div>

          {/* Row 4: Available Dates & Features */}
          <div className="form-row">
            <div className="form-group">
              <label>Available Dates</label>
              <input
                type="text"
                name="availableDates"
                value={formData.availableDates}
                onChange={handleChange}
                placeholder="2025-10-25, 2025-10-26, 2025-10-27"
              />
              <small className="help-text">Comma-separated dates in YYYY-MM-DD format</small>
              {errors.availableDates && <span className="error-text">{errors.availableDates}</span>}
            </div>
            <div className="form-group">
              <label>Features (comma-separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Safety gear, Photos, Guide"
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="required">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the tour experience..."
                rows="4"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          {/* Row 6: Image Upload */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Tour Image (Max 5MB)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="file-preview">
                  <img src={imagePreview} alt="Preview" />
                  <div className="file-info">
                    <div className="file-name">{image?.name}</div>
                    <div className="file-size">{(image?.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button type="button" className="remove-file" onClick={removeImage}>×</button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-row submit-section">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating Tour...' : '✅ Add Kayak Tour'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/tours')}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTour;