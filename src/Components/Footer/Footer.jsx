'use client';
import React from 'react'
import './Footer.css'
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
const Footer = () => {
    
    return (

  <div className="footer-wrapper premium-bg">
    <footer className="footer-main">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo" style={{ color: '#c9a96e' }}>Campus Craves</span>
          <div className="footer-gold-divider" />
          <p className="footer-desc">Your one-stop solution for quick and hassle-free online food ordering at campus canteens. Satisfy your cravings effortlessly!</p>
        </div>
        <div className="footer-socials">
          <a className="footer-social-icon" href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a className="footer-social-icon" href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a className="footer-social-icon" href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Campus Craves. All rights reserved.
        </span>
      </div>
    </footer>
  </div>
    )
}

export default Footer
