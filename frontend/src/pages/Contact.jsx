import React, { useState } from 'react';
import './contact.scss';
import { FaInstagram,FaFacebookF } from "react-icons/fa";
import { CiTwitter,CiYoutube } from "react-icons/ci";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Contact us for any inquiries about our kayak tours at Elad Check Dam.</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>Reach out to us through any of the following channels:</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Visit Us</h3>
                  <p>Club Canova Kayak Center<br />Elad Check Dam<br />perinthalmanna, Kerala 680001</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h3>Call Us</h3>
                  <p>+91 7561012039<br />+91 89433 54104 </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h3>Email Us</h3>
                  <p>info@clubcanova.com<br />bookings@clubcanova.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <h3>Opening Hours</h3>
                  <p>Monday - Sunday: 6:00 AM - 6:00 PM<br />Best time: Morning & Evening</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="social-links">
              <h3>Follow Our Adventures</h3>
              <div className="social-icons">
                <a href="#" className="social-link" title="Facebook"><FaFacebookF /></a>
                <a href="#" className="social-link" title="Instagram"><FaInstagram/></a>
                <a href="#" className="social-link" title="Twitter"><CiTwitter/></a>
                <a href="#" className="social-link" title="YouTube"><CiYoutube/></a>
              </div>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="contact-form-map">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Kayak Booking</option>
                      <option value="group">Group Tour</option>
                      <option value="training">Kayak Training</option>
                      <option value="event">Special Event</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your preferred kayak tour date, number of people, and any special requirements..."
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>

            {/* Google Map with Elad Check Dam Location */}
            <div className="map-container">
              <h2>Find Us at Elad Check Dam</h2>
              <div className="google-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424835873091!2d76.24477197599664!3d10.886923100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cfd83fb335cf%3A0x97d2f3a7f8dd4acb!2sElad%20check%20dam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '10px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Club Canova at Elad Check Dam Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is kayaking safe at Elad Check Dam?</h3>
              <p>Absolutely! The check dam provides calm, controlled waters perfect for kayaking. Our expert guides ensure complete safety with proper equipment and training.</p>
            </div>
            <div className="faq-item">
              <h3>What are the best times for kayaking?</h3>
              <p>Early morning (6-9 AM) and evening (4-6 PM) are ideal. The weather is pleasant and the light is perfect for photography.</p>
            </div>
            <div className="faq-item">
              <h3>Do you provide kayaking equipment?</h3>
              <p>Yes! We provide all necessary equipment including kayaks, paddles, life jackets, and safety gear. Just bring your enthusiasm!</p>
            </div>
            <div className="faq-item">
              <h3>Can beginners try kayaking here?</h3>
              <p>Definitely! Elad Check Dam's calm waters are perfect for beginners. Our instructors provide comprehensive training before you start.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;