import { motion, useReducedMotion } from 'motion/react';

export default function Hero({ portrait, official }) {
  const reduce = useReducedMotion();
  const img = portrait || official;

  return (
    <header id="top" className="hero">
      <div className="hero-copy">
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="line" />
          <span className="eyebrow">Creative Portfolio &amp; Lookbook</span>
        </motion.div>

        <motion.h1
          className="display"
          initial={{ opacity: 0, y: reduce ? 0 : 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Nholyn
          <br />
          <em>Grace</em>
        </motion.h1>

        <motion.div
          className="hero-role"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          Designer &middot; Creative Director
        </motion.div>

        <motion.p
          className="hero-text"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          Twenty-two looks, one signature. A visual journal of identity work, editorial
          craft, and live moments — designed with intention, styled with a point of view.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#lookbook" className="btn btn-solid">
            View the Lookbook
          </a>
          <a href="#contact" className="btn">
            Start a Project
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero-art"
        initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-portrait">
          {img && <img src={img} alt="Nholyn Grace" />}
          <div className="hero-floater">Creative Portfolio &middot; 2026</div>
        </div>
      </motion.div>
    </header>
  );
}
