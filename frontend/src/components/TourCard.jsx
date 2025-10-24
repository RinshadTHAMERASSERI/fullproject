// src/components/TourCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {tour.image && (
        <img 
          src={`http://localhost:5000${tour.image}`} 
          alt={tour.title}
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover' 
          }}
        />
      )}
      <div style={{ 
        padding: '20px', 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '10px' 
        }}>
          <h3 style={{ margin: 0, color: '#0a5f75', fontSize: '1.3rem' }}>
            {tour.title}
          </h3>
          <span style={{ 
            background: tour.difficulty === 'Easy' ? '#d4edda' : 
                      tour.difficulty === 'Moderate' ? '#fff3cd' : '#f8d7da',
            color: tour.difficulty === 'Easy' ? '#155724' : 
                   tour.difficulty === 'Moderate' ? '#856404' : '#721c24',
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '0.8rem', 
            fontWeight: 'bold'
          }}>
            {tour.difficulty}
          </span>
        </div>
        
        <p><strong>📍 {tour.location}</strong></p>
        <p>⏱️ {tour.duration}</p>
        <p style={{ marginTop: 'auto' }}><strong>💰 ₹{tour.price}</strong></p>
        
        <Link 
          to={`/tours/${tour._id}`} 
          style={{
            display: 'inline-block',
            marginTop: '15px',
            padding: '10px 20px',
            background: '#0a5f75',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            textAlign: 'center'
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TourCard;