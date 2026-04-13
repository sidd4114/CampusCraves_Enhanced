'use client';
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import './Card.css';

const Card = forwardRef(({ image, title, text, category, link }, ref) => {
  return (
    <Link href={link} className="specials-card-link" tabIndex={-1}>
      <div ref={ref} className="specials-card">
        {/* Full-bleed background image */}
        <div className="specials-card-img-wrap">
          <img src={image} alt={title} />
        </div>

        {/* Category eyebrow — top left like Apple */}
        {category && (
          <span className="specials-card-category">{category}</span>
        )}

        {/* Content overlay — bottom of card */}
        <div className="specials-card-body">
          <h5 className="specials-card-title">{title}</h5>
          <p className="specials-card-text">{text}</p>
          <span className="specials-card-btn">Order Now →</span>
        </div>
      </div>
    </Link>
  );
});

Card.displayName = 'Card';

Card.defaultProps = {
  image: 'https://via.placeholder.com/300x420',
  title: 'Default Title',
  text: 'Default text.',
  category: '',
  link: '/menu',
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  category: PropTypes.string,
  link: PropTypes.string.isRequired,
};

export default Card;
