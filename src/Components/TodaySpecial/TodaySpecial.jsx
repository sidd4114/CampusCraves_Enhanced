'use client';
import React, { useEffect, useRef } from 'react';
import './TodaySpecial.css';
import Card from '../Card/Card';

const TodaysSpecials = () => {
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const staticEls = [
      eyebrowRef.current,
      headingRef.current,
      dividerRef.current,
    ].filter(Boolean);

    const cardEls = cardsRef.current.filter(Boolean);

    // ── Header elements: reveal as a group when eyebrow enters ──
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        staticEls.forEach((el) => el.classList.add('slide-in'));
        headerObserver.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );
    if (eyebrowRef.current) headerObserver.observe(eyebrowRef.current);

    // ── Cards: each triggers independently for staggered feel ──
    const STAGGER = [0.05, 0.2, 0.35, 0.5];
    cardEls.forEach((el, i) => {
      // Bake the delay into the element's style BEFORE observing
      // so it's already set when the class is added.
      el.style.transitionDelay = `${STAGGER[i] ?? 0}s`;
    });

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('in-view');
            cardObserver.unobserve(el);
            // Reset delay after reveal so hover transitions aren't delayed
            const delay = parseFloat(el.style.transitionDelay || 0) * 1000;
            setTimeout(() => { el.style.transitionDelay = ''; }, delay + 900);
          }
        });
      },
      { threshold: 0 }          // fire the instant ANY pixel enters the viewport
    );
    cardEls.forEach((el) => cardObserver.observe(el));

    return () => {
      headerObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  const specials = [
    { image: "../specials_img/gulabjamun.jpg", title: "Gulab Jamun", category: "Dessert", text: "Soft, golden dumplings soaked in rich, aromatic syrup — a timeless Indian dessert that's sweet, warm, and irresistible." },
    { image: "../specials_img/dhokla.jpg", title: "Dhokla", category: "Snack", text: "A soft, fluffy steamed snack with a tangy flavor, topped with mustard seeds and curry leaves." },
    { image: "../bg3.jpg", title: "Noodles", category: "Mains", text: "A deliciously tangled mix of flavors, spices, and textures, perfect for satisfying cravings." },
    { image: "../specials_img/pizza_bg.jpeg", title: "Chicken Pizza", category: "Fan Favourite", text: "A cheesy delight loaded with tender chicken, rich sauce, and a crispy crust for the perfect bite." },
  ];

  return (
    <div className="todays-specials">
      <p className="specials-eyebrow" ref={eyebrowRef}>Chef&apos;s Selection</p>
      <h1 className="specials-heading" ref={headingRef}>Today&apos;s Specials</h1>
      <hr className="specials-divider" ref={dividerRef} />
      <div className="d-flex justify-content-around" style={{ gap: '28px' }}>
        {specials.map((item, i) => (
          <Card
            key={i}
            ref={el => cardsRef.current[i] = el}
            image={item.image}
            title={item.title}
            text={item.text}
            category={item.category}
            link="/menu"
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysSpecials;
