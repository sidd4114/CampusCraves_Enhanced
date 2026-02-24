'use client';
import React, { useEffect, useRef } from 'react';
import './TodaySpecial.css';
import Card from '../Card/Card';

const TodaysSpecials = () => {
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const heading = headingRef.current;
      if (heading) {
        const rect = heading.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          heading.classList.add('slide-in');
        }
      }

      cardsRef.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          card.classList.add('in-view');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const specials = [
    { image: "../specials_img/gulabjamun.jpg", title: "Gulab Jamun", text: "Soft, golden dumplings soaked in rich, aromatic syrup — a timeless Indian dessert that's sweet, warm, and irresistible." },
    { image: "../specials_img/dhokla.jpg", title: "Dhokla", text: "A soft, fluffy steamed snack with a tangy flavor, topped with mustard seeds and curry leaves." },
    { image: "../bg3.jpg", title: "Noodles", text: "A deliciously tangled mix of flavors, spices, and textures, perfect for satisfying cravings." },
    { image: "../specials_img/pizza_bg.jpeg", title: "Chicken Pizza", text: "A cheesy delight loaded with tender chicken, rich sauce, and a crispy crust for the perfect bite." },
  ];

  return (
    <div className="todays-specials">
      <p className="specials-eyebrow">Chef&apos;s Selection</p>
      <h1 className="specials-heading" ref={headingRef}>Today&apos;s Specials</h1>
      <hr className="specials-divider" />
      <div className="d-flex flex-wrap justify-content-around" style={{ gap: '28px' }}>
        {specials.map((item, i) => (
          <Card
            key={i}
            ref={el => cardsRef.current[i] = el}
            image={item.image}
            title={item.title}
            text={item.text}
            link="/menu"
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysSpecials;
