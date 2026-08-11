import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const WORDS = ['Lookbook', 'Brand Identity', 'Editorial', 'Magazine Covers', 'Design Systems'];

export default function Marquee() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;

    let width = 0;
    let raf = 0;
    let last = 0;

    const step = (t) => {
      const dt = (t - last) / 1000;
      last = t;
      width += dt * 60;
      if (width >= track.scrollWidth / 2) width = 0;
      track.style.transform = `translateX(${-width}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const items = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {items.map((w, i) => (
          <span className="marquee-item" key={i}>
            {w} <span className="dot">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function StaticMarquee() {
  return (
    <motion.div
      className="marquee"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      aria-hidden="true"
    >
      <div className="marquee-track" style={{ transform: 'none' }}>
        {[...WORDS, ...WORDS].map((w, i) => (
          <span className="marquee-item" key={i}>
            {w} <span className="dot">&bull;</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
