// Home.js — Fully Fixed & Optimized
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

// Import images
import expertGuidesImg from '../assets/lifeguard.jpg';
import ecoFriendlyImg from '../assets/bg.jpg';
import premiumKayaksImg from '../assets/Delta 12s.png';
import memorablePhotosImg from '../assets/Guided Tours.jpg';
import safetyEquipmentImg from '../assets/Equipments and supply.jpg';
import familyFriendlyImg from '../assets/family.jpg';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const allFeatures = [
    {
      id: 1,
      image: expertGuidesImg,
      title: "Expert Guides",
      description: "Certified instructors with years of experience in Kerala's waterways"
    },
    {
      id: 2,
      image: ecoFriendlyImg,
      title: "Eco-Friendly",
      description: "Sustainable tourism that preserves Kerala's natural beauty"
    },
    {
      id: 3,
      image: premiumKayaksImg,
      title: "Premium Kayaks",
      description: "Top-quality equipment for a safe and comfortable experience"
    },
    {
      id: 4,
      image: memorablePhotosImg,
      title: "Memorable Photos",
      description: "Capture your adventure with complimentary photography"
    },
    {
      id: 5,
      image: safetyEquipmentImg,
      title: "Safety First",
      description: "Top-notch safety equipment and trained rescue personnel"
    },
    {
      id: 6,
      image: familyFriendlyImg,
      title: "Family Friendly",
      description: "Perfect for all age groups with special packages for families"
    }
  ];

  // ✅ Single auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]); // Only depends on isAutoPlaying

  // Get 3 visible features (current + next 2)
  const visibleFeatures = Array.from({ length: 3 }, (_, i) => {
    const index = (currentIndex + i) % allFeatures.length;
    return allFeatures[index];
  });

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % allFeatures.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + allFeatures.length) % allFeatures.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // ✅ Define these for JSX
  const prevSlide = () => handlePrev();
  const nextSlide = () => handleNext();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title animate-fade-in">
              Paddle Through Paradise
            </h1>
            <p className="hero-subtitle animate-fade-in-delay">
              Explore Kerala's serene backwaters with expert-guided kayak tours. 
              Safe, eco-friendly, and unforgettable adventures await you.
            </p>
            <div className="hero-buttons animate-slide-up">
              <Link to="/tours" className="btn btn-primary">
                View All Tours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Kayak Adventure?</h2>

          <div
            className="slideshow-wrapper"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous slide">
              ‹
            </button>

            <div className="slideshow">
              {visibleFeatures.map((feature, idx) => (
                <div key={`${feature.id}-${idx}`} className="slide">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="slide-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="slide-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="nav-btn next" onClick={nextSlide} aria-label="Next slide">
              ›
            </button>
          </div>

          <div className="indicators">
            {allFeatures.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tours Preview */}
      <section className="tours-preview">
        <div className="container">
          <h2 className="section-title">Popular Tours</h2>
          <div className="tours-grid">
            <div className="tour-preview-card">
              <div className="tour-image backwaters-tour"></div>
              <div className="tour-info">
                <h3>Backwaters Explorer</h3>
                <p>3-hour journey through serene backwaters</p>
                <span className="price">₹399</span>
              </div>
            </div>
            <div className="tour-preview-card">
              <div className="tour-image sunset-tour"></div>
              <div className="tour-info">
                <h3>Sunset Paddling</h3>
                <p>Evening tour with breathtaking sunset views</p>
                <span className="price">₹499</span>
              </div>
            </div>
            <div className="tour-preview-card">
              <div className="tour-image mangrove-tour"></div>
              <div className="tour-info">
                <h3>Mangrove Forest</h3>
                <p>Explore unique mangrove ecosystems</p>
                <span className="price">₹599</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/tours" className="btn btn-outline">
              See All Tours
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready for Your Adventure?</h2>
          <p>Book your kayak tour today and create memories that last a lifetime</p>
          <Link to="/tours" className="btn btn-primary btn-large">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;