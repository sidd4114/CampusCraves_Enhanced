'use client';
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import './Card.css';

const Card = forwardRef(({ image, title, text, link }, ref) => {
  return (
    <div
      ref={ref}
      className="specials-card"
    >
      <div className="specials-card-img-wrap">
        <img src={image} alt={title} />
      </div>
      <div className="specials-card-body">
        <h5 className="specials-card-title">{title}</h5>
        <p className="specials-card-text">{text}</p>
        <Link href="/menu" className="specials-card-btn">
          View in Menu
        </Link>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

Card.defaultProps = {
  image: 'https://via.placeholder.com/150',
  title: 'Default Title',
  text: 'Default text content for the card.',
  link: '/menu',
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Card;
