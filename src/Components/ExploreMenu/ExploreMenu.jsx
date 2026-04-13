'use client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { StoreContext } from '../../context/StoreContext';
import './ExploreMenu.css';

const categoryOrder = [
  'All',
  'Beverages',
  'Indian Snacks',
  'Noodles',
  'Rice',
  'South Indian',
  "Today's Special",
];

const normalizeCategory = (value) => {
  const raw = (value || '').toString().trim();
  if (!raw) return '';
  const cleaned = raw.toLowerCase().replace(/[_-]+/g, ' ').trim();

  if (cleaned === 'south indian' || cleaned === 'southindian') return 'South Indian';
  if (cleaned === 'indian snacks' || cleaned === 'snacks') return 'Indian Snacks';
  if (cleaned === 'beverages' || cleaned === 'drinks') return 'Beverages';
  if (cleaned === 'noodles' || cleaned === 'noodle') return 'Noodles';
  if (cleaned === 'rice') return 'Rice';

  return raw;
};

const resolveSpecials = (items) => {
  const specials = items.filter((item) =>
    item?.isSpecial || item?.special || item?.isFeatured
  );
  if (specials.length) return specials;
  return items.slice(0, 8);
};

const ExploreMenu = ({ category, setCategory }) => {
  const { foodList, cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const [visibleCategory, setVisibleCategory] = useState(category || 'All');
  const railRefs = useRef({});
  const prevCategoryRef = useRef(category || 'All');

  const normalizedItems = useMemo(() => (
    foodList.map((item) => ({
      ...item,
      normalizedCategory: normalizeCategory(item.category),
    }))
  ), [foodList]);

  const categories = useMemo(() => {
    const normalizedSet = new Set(
      normalizedItems.map((item) => item.normalizedCategory).filter(Boolean)
    );

    const extras = Array.from(normalizedSet).filter(
      (label) => !categoryOrder.includes(label)
    );

    return [...categoryOrder, ...extras];
  }, [normalizedItems]);

  const itemsByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach((label) => {
      grouped[label] = [];
    });

    normalizedItems.forEach((item) => {
      if (!item.normalizedCategory) return;
      if (!grouped[item.normalizedCategory]) {
        grouped[item.normalizedCategory] = [];
      }
      grouped[item.normalizedCategory].push(item);
    });

    grouped.All = normalizedItems;
    grouped["Today's Special"] = resolveSpecials(normalizedItems);

    return grouped;
  }, [categories, normalizedItems]);

  const activeCategory = category || 'All';

  useEffect(() => {
    const next = activeCategory;
    const prev = prevCategoryRef.current;
    const nextEl = railRefs.current[next];

    if (!nextEl) return;

    if (prev === next) {
      gsap.set(nextEl, { autoAlpha: 1, y: 0 });
      setVisibleCategory(next);
      return;
    }

    const prevEl = railRefs.current[prev];
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (prevEl) {
      timeline.to(prevEl, { autoAlpha: 0, y: 18, duration: 0.25, ease: 'power2.in' });
    }

    timeline
      .add(() => {
        setVisibleCategory(next);
        gsap.set(nextEl, { autoAlpha: 0, y: -18 });
      })
      .to(nextEl, { autoAlpha: 1, y: 0, duration: 0.35 });

    prevCategoryRef.current = next;

    return () => timeline.kill();
  }, [activeCategory]);

  useEffect(() => {
    const focusTrack = (track) => {
      if (!track) return;
      const cards = Array.from(track.querySelectorAll('.menu-card'));
      if (!cards.length) return;

      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let closest = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = card;
        }
      });

      cards.forEach((card) => {
        card.classList.toggle('is-focused', card === closest);
      });
    };

    const tracks = Object.values(railRefs.current).map((panel) =>
      panel?.querySelector('.menu-rail')
    );

    const handlers = tracks.map((track) => {
      if (!track) return null;
      const handle = () => focusTrack(track);
      track.addEventListener('scroll', handle, { passive: true });
      window.addEventListener('resize', handle);
      handle();
      return { track, handle };
    });

    return () => {
      handlers.forEach((entry) => {
        if (!entry) return;
        entry.track.removeEventListener('scroll', entry.handle);
        window.removeEventListener('resize', entry.handle);
      });
    };
  }, [categories, visibleCategory]);

  return (
    <section className="explore-menu" aria-label="Food discovery rail">
      <div className="menu-rail-header">
        <span className="section-label">Food discovery</span>
        <h1>Check out our Cravings</h1>
        <p className="explore-menu-text">
          Explore a variety of mouthwatering dishes tailored to suit every craving.
          Move vertically to switch categories, then glide horizontally to explore each rail.
        </p>
      </div>

      <div className="menu-rail-shell">
        <nav className="menu-rail-categories" aria-label="Menu categories">
          <span className="menu-rail-kicker">Categories</span>
          <div className="menu-rail-category-list" role="list">
            {categories.map((label) => (
              <button
                key={label}
                type="button"
                className={`menu-rail-category ${activeCategory === label ? 'is-active' : ''}`}
                onClick={() => setCategory(label)}
                aria-current={activeCategory === label ? 'true' : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="menu-rail-stage" aria-live="polite">
          {categories.map((label) => {
            const items = itemsByCategory[label] || [];
            const isVisible = visibleCategory === label;

            return (
              <div
                key={label}
                ref={(el) => {
                  railRefs.current[label] = el;
                }}
                className={`menu-rail-panel ${isVisible ? 'is-active' : ''}`}
                aria-hidden={!isVisible}
              >
                <div className="menu-rail" role="region" aria-label={`${label} rail`}>
                  <div className="menu-rail-track">
                    {items.length ? (
                      items.map((item) => (
                        <article key={item._id} className="menu-card" tabIndex={0}>
                          <div className="menu-card-media">
                            <img src={item.image} alt={item.name} loading="lazy" />
                            {!cartItems[item._id] ? (
                              <button
                                type="button"
                                className="menu-card-add"
                                onClick={() => addToCart(item._id)}
                                aria-label={`Add ${item.name} to cart`}
                              >
                                +
                              </button>
                            ) : (
                              <div className="menu-card-counter" aria-label={`${item.name} quantity controls`}>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item._id)}
                                  aria-label={`Remove one ${item.name}`}
                                >
                                  -
                                </button>
                                <span>{cartItems[item._id]}</span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(item._id)}
                                  aria-label={`Add one ${item.name}`}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="menu-card-body">
                            <div className="menu-card-header">
                              <h3>{item.name}</h3>
                              <span className="menu-card-price">₹{item.price}</span>
                            </div>
                            <p className="menu-card-desc">{item.description}</p>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="menu-rail-empty">No items available yet.</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreMenu;