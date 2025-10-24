import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Aboute.scss';

// Import your local images
import customer1 from '../assets/custemer2.jpg';
import teamPhoto from '../assets/custemer1.jpg';
import kayakAdventure from '../assets/custemer5.jpg';
import bg from '../assets/bg.jpg';

const About = () => {
  // Why Choose Us Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      icon: "🛡️",
      title: "Safety First",
      description: "Certified instructors, quality equipment, and comprehensive safety protocols ensure your adventure is risk-free."
    },
    {
      icon: "🌊",
      title: "Perfect Location",
      description: "Elad Check Dam offers calm, controlled waters ideal for beginners and perfect for peaceful kayaking."
    },
    {
      icon: "👨‍🏫",
      title: "Expert Guides",
      description: "Our certified instructors provide personalized training and guidance for paddlers of all skill levels."
    },
    {
      icon: "💰",
      title: "Best Value",
      description: "Premium kayaking experiences at affordable prices with no hidden costs."
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after manual interaction
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % features.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + features.length) % features.length);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About Club Canova</h1>
            <p className="hero-subtitle">
              Pioneering Kayaking Adventures at Elad Check Dam, Thrissur
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Safety Record</span>
              </div>
            </div>
          </div>
        </div>
      </section>
 {/* Why Choose Us Section with Slideshow */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose Club Canova?</h2>
          
          <div 
            className="features-slider"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div 
              className="features-track"
              style={{ 
                transform: `translateX(-${currentSlide * 25}%)` 
              }}
            >
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="slider-controls">
              <button className="slider-nav" onClick={prevSlide}>
                ‹
              </button>
              
              <div className="slider-dots">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              
              <button className="slider-nav" onClick={nextSlide}>
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="section-subtitle">Passionate water sports enthusiasts dedicated to your kayaking adventure</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <img 
                  src={kayakAdventure} 
                  alt="Arun Kumar - Founder" 
                  onError={(e) => {
                    e.target.src = '';
                  }}
                />
              </div>
              <h3>Arun Kumar</h3>
              <p className="member-role">Founder & Head Instructor</p>
              <p className="member-bio">Water sports enthusiast with 8+ years of kayaking experience and certified instructor.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img 
                  src={customer1} 
                  alt="Priya Nair - Operations Manager" 
                  onError={(e) => {
                    e.target.src = '';
                  }}
                />
              </div>
              <h3>Priya Nair</h3>
              <p className="member-role">Operations Manager</p>
              <p className="member-bio">Ensures smooth operations and customer satisfaction with 5 years in adventure tourism.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img 
                  src={teamPhoto} 
                  alt="Rajesh Menon - Safety Instructor" 
                />
              </div>
              <h3>Rajesh Menon</h3>
              <p className="member-role">Safety Instructor</p>
              <p className="member-bio">Certified lifeguard and water safety expert with extensive rescue training experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>🌿 Eco-Friendly</h3>
              <p>We practice and promote sustainable tourism, ensuring our activities don't harm the natural environment.</p>
            </div>
            <div className="value-card">
              <h3>🤝 Customer First</h3>
              <p>Your safety and satisfaction are our top priorities. We go above and beyond to create memorable experiences.</p>
            </div>
            <div className="value-card">
              <h3>💪 Quality Service</h3>
              <p>From equipment to instruction, we maintain the highest standards in everything we do.</p>
            </div>
            <div className="value-card">
              <h3>🏆 Community</h3>
              <p>We're building a community of water sports lovers and contributing to local tourism development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Start Your Kayaking Adventure?</h2>
          <p>Join us at Elad Check Dam and discover the joy of kayaking in the perfect setting.</p>
          <div className="cta-buttons">
            <Link to="/tours" className="btn btn-primary">View Tours</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;