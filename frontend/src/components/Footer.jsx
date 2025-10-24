import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-about">
          <h3>Kayak Adventure</h3>
          <p>
            Experience the thrill of kayaking with certified guides at Elad Check Dam, Thrissur.
            Safety, fun, and nature — all in one adventure.
          </p>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tours">Tours</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><FaMapMarkerAlt /> Elad Check Dam,Perinthalmanna, Kerala</p>
          <p><FaPhoneAlt /> +91 98765 43210</p>
          <p><FaEnvelope /> info@kayakadventure.com</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kayak Adventure. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
