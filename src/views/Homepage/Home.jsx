'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useTransform } from 'motion/react';
import './Home.css';
import TodaysSpecials from '../../Components/TodaySpecial/TodaySpecial';
import Aboutus from "../../Components/Aboutus/Aboutus";
import Footer from "../../Components/Footer/Footer";

const FRAME_COUNT = 240;
const FRAME_START = 1;
const FRAME_PATH = '/frames/frame_';
const FRAME_EXT = '.png';

const padFrame = (value) => String(value).padStart(4, '0');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getFrameSrc = (index) => `${FRAME_PATH}${padFrame(index + FRAME_START)}${FRAME_EXT}`;

function Home() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(true);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [framesReady, setFramesReady] = useState(false);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);
  const touchStartRef = useRef(null);
  const canvasRef = useRef(null);
  const frameCacheRef = useRef([]);
  const revealSectionRef = useRef(null);
  const revealTextRef = useRef(null);
  const revealOriginalTextRef = useRef('');
  const impactSectionRef = useRef(null);
  const hasAnimatedImpactRef = useRef(false);
  const [impactValues, setImpactValues] = useState([0, 0, 0]);
  const [impactActive, setImpactActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const overlayProgress = useMotionValue(0);
  const overlayOpacity = useTransform(overlayProgress, [0, 0.12, 0.35], [0, 0.6, 1]);

  const frameSources = useMemo(() => (
    Array.from({ length: FRAME_COUNT }, (_, idx) => getFrameSrc(idx))
  ), []);

  useEffect(() => {
    let isMounted = true;
    const preloadFrames = async () => {
      const cache = frameSources.map((src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = src;
      }));

      const loaded = await Promise.all(cache);
      frameCacheRef.current = loaded;

      if (isMounted) {
        setFramesReady(true);
        setFrameIndex((value) => value);
      }
    };

    preloadFrames();
    return () => {
      isMounted = false;
    };
  }, [frameSources]);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      const img = frameCacheRef.current[frameIndex];
      if (!img || !img.complete) return;

      const { width: canvasWidth, height: canvasHeight } = canvas;
      const drawWidth = img.naturalWidth;
      const drawHeight = img.naturalHeight;
      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [frameIndex, framesReady]);

  useEffect(() => {
    const updateFrame = () => {
      rafRef.current = requestAnimationFrame(updateFrame);
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const next = current + (target - current) * 0.12;
      smoothProgressRef.current = Math.abs(target - next) < 0.0005 ? target : next;
      setSmoothProgress(smoothProgressRef.current);

      const nextIndex = clamp(
        Math.round(smoothProgressRef.current * (FRAME_COUNT - 1)),
        0,
        FRAME_COUNT - 1
      );

      if (nextIndex !== lastFrameRef.current) {
        lastFrameRef.current = nextIndex;
        setFrameIndex(nextIndex);
      }

      if (nextIndex === FRAME_COUNT - 1) {
        setIsPinned(false);
      }
    };

    const startLoop = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(updateFrame);
    };

    const handleWheel = (event) => {
      if (!isPinned) return;
      event.preventDefault();
      const delta = clamp(event.deltaY, -120, 120);
      const step = clamp(delta * 0.0009, -0.012, 0.012);
      targetProgressRef.current = clamp(targetProgressRef.current + step, 0, 1);
      startLoop();
    };

    const handleTouchStart = (event) => {
      if (!isPinned) return;
      if (event.touches.length === 1) {
        touchStartRef.current = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event) => {
      if (!isPinned) return;
      if (touchStartRef.current === null) return;
      const currentY = event.touches[0].clientY;
      const delta = clamp(touchStartRef.current - currentY, -120, 120);
      touchStartRef.current = currentY;
      const step = clamp(delta * 0.0011, -0.014, 0.014);
      targetProgressRef.current = clamp(targetProgressRef.current + step, 0, 1);
      event.preventDefault();
      startLoop();
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    if (isPinned) {
      document.body.classList.add('cinematic-lock');
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      startLoop();
    } else {
      document.body.classList.remove('cinematic-lock');
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.body.classList.remove('cinematic-lock');
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPinned]);

  const parallaxOffset = -12 + smoothProgress * 24;
  const titleScale = 0.9 + smoothProgress * 0.14;
  const titleBlur = Math.max(0, 10 - smoothProgress * 10);
  const titleOpacity = 0.6 + smoothProgress * 0.4;

  useEffect(() => {
    overlayProgress.set(smoothProgress);
  }, [smoothProgress, overlayProgress]);

  useEffect(() => {
    if (!revealSectionRef.current || !revealTextRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textElement = revealTextRef.current;
    const originalText = revealOriginalTextRef.current || textElement.textContent || '';
    revealOriginalTextRef.current = originalText;

    if (reduceMotion) {
      textElement.textContent = originalText;
      return;
    }

    textElement.textContent = '';
    textElement.setAttribute('aria-label', originalText);

    const srSpan = document.createElement('span');
    srSpan.className = 'sr-only';
    srSpan.textContent = originalText;
    textElement.appendChild(srSpan);

    const letterContainer = document.createElement('span');
    letterContainer.className = 'reveal-letter-group';
    letterContainer.setAttribute('aria-hidden', 'true');
    textElement.appendChild(letterContainer);

    const fragment = document.createDocumentFragment();
    Array.from(originalText).forEach((char) => {
      const span = document.createElement('span');
      span.className = 'reveal-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      fragment.appendChild(span);
    });
    letterContainer.appendChild(fragment);

    const letters = letterContainer.querySelectorAll('.reveal-letter');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { opacity: 0.08, filter: 'blur(6px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: { each: 0.015, from: 'start' },
          scrollTrigger: {
            trigger: revealSectionRef.current,
            start: 'top 78%',
            end: 'bottom 48%',
            scrub: true,
          },
        }
      );
    }, revealSectionRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      textElement.textContent = originalText;
    };
  }, []);

  useEffect(() => {
    const section = impactSectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = [15, 3, 70];

    if (reduceMotion) {
      setImpactValues(targets);
      hasAnimatedImpactRef.current = true;
      return;
    }

    const duration = 1700;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      if (hasAnimatedImpactRef.current) return;
      hasAnimatedImpactRef.current = true;
      setImpactActive(true);
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = easeOutCubic(progress);
        setImpactValues(targets.map((value) => Math.round(value * eased)));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* ── Cinematic hero ── */}
      <section
        className={`cinematic-hero ${isPinned ? 'is-pinned' : 'is-unpinned'}`}
        aria-label="Cinematic landing hero"
      >
        <div className="pin-sticky">
          <div className="frame-stage">
            <canvas
              className="frame-canvas"
              ref={canvasRef}
              aria-hidden="true"
            />
            <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }}>
              <h1
                className="parallax-title"
                style={{
                  transform: `translate3d(0, ${parallaxOffset}px, 0) scale(${titleScale})`,
                  filter: `blur(${titleBlur}px)`,
                  opacity: titleOpacity,
                }}
              >
                Campus Craves
              </h1>

              <div
                className="hero-actions"
                style={{ transform: `translate3d(0, ${parallaxOffset * 0.3}px, 0)` }}
              >
                <a className="btn primary" href="/menu">Order now</a>
                <a className="btn ghost"  href="/preorder">Preorder</a>
              </div>

              <div className="scroll-hint" aria-hidden="true">
                <span>{isTouchDevice ? 'Swipe to explore' : 'Scroll to explore'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="reveal-section"
        ref={revealSectionRef}
        aria-label="Pickup flow highlight"
      >
        <div className="reveal-inner">
          <p className="eyebrow">Designed for the mid-day rush</p>
          <h2 className="reveal-heading" ref={revealTextRef}>
            Every pickup stays warm, ordered, and ready the moment you arrive.
          </h2>
          <p className="reveal-sub">
            From canteen to comfort, one bite at a time.
          </p>
        </div>
      </section>

      <section
        className="impact-section"
        ref={impactSectionRef}
        aria-label="Impact metrics"
      >
        <div className="impact-inner">
          <p className="eyebrow">Impact in a 30-minute break</p>
          <h2 className="impact-heading">Minutes back. Lines gone.</h2>
          <p className="impact-sub">
            Designed to turn a rushed break into a predictable, fast pickup.
          </p>

          <div className={`impact-grid ${impactActive ? 'is-active' : ''}`}>
            <div className="impact-card">
              <div className="impact-number">
                <span className="impact-value">{impactValues[0]}</span>
                <span className="impact-suffix"> min</span>
              </div>
              <p className="impact-label">saved per break</p>
            </div>

            <div className="impact-card">
              <div className="impact-number">
                <span className="impact-value">{impactValues[1]}</span>
                <span className="impact-suffix">×</span>
              </div>
              <p className="impact-label">faster ordering</p>
            </div>

            <div className="impact-card">
              <div className="impact-number">
                <span className="impact-value">{impactValues[2]}</span>
                <span className="impact-suffix">%</span>
              </div>
              <p className="impact-label">less waiting time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-surface">
        <TodaysSpecials />
        <Aboutus />
      </section>

      <Footer />
    </div>
  );
}

export default Home;