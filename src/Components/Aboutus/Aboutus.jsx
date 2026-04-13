
import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Aboutus.css';

const Aboutus = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const team = useMemo(() => ([
    {
      name: 'Siddhen Pise',
      role: 'Founder & CEO',
      image: '/people/siddhen.jpg',
      copy: 'Guiding the vision for fast, smart campus dining experiences.',
    },
    {
      name: 'Sharon Saju',
      role: 'Co-Founder & CTO',
      image: '/people/sharon.jpg',
      copy: 'Building the tech backbone that keeps pickups effortless.',
    },
    {
      name: 'Sharon Mishra',
      role: 'Co-Founder & COO',
      image: '/people/sharonm.jpg',
      copy: 'Orchestrating operations so every order lands perfectly on time.',
    },
    {
      name: 'Aditya Patil',
      role: 'Co-Founder & CMO',
      image: '/people/aditya.jpg',
      copy: 'Amplifying the Campus Craves story across every campus.',
    },
  ]), []);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const lineFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="who-are-we premium-bg" ref={sectionRef}>
      <motion.div className="who-sticky-title" style={{ opacity: titleOpacity }}>
        WHO ARE WE
      </motion.div>

      <div className="who-timeline">
        <div className="timeline-line" aria-hidden="true">
          <motion.span className="timeline-line-fill" style={{ scaleY: lineFill }} />
        </div>

        <div className="timeline-items">
          {team.map((member, index) => {
            const step = 1 / team.length;
            const start = index * step;
            const end = start + step;
            const mid = (start + end) / 2;

            const opacity = useTransform(
              scrollYProgress,
              [Math.max(0, start - 0.08), start, mid, end, Math.min(1, end + 0.08)],
              [0.35, 0.6, 1, 0.6, 0.35]
            );
            const y = useTransform(scrollYProgress, [start, mid], [24, 0]);
            const scale = useTransform(scrollYProgress, [start, mid], [0.97, 1]);

            return (
              <motion.div
                key={member.name}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                style={{ opacity, y, scale }}
              >
                <div className="timeline-card">
                  <div className="timeline-media">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="timeline-copy">
                    <h3>{member.name}</h3>
                    <span>{member.role}</span>
                    <p>{member.copy}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
