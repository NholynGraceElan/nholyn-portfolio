import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Reveal from './Reveal.jsx';

const TESTIMONIALS = [
  {
    quote:
      "Nholyn translated our brand into a visual language that finally matches how we sound. Clients notice the difference immediately.",
    name: 'Find & Folds',
    role: 'Brand Identity Project',
  },
  {
    quote:
      "From the first lookbook page to the final cover, everything arrived polished and on time. A creative eye and a true professional.",
    name: 'Editorial Client',
    role: 'Magazine Cover Project',
  },
  {
    quote:
      "She organized our entire workspace into something the whole team can actually use. No more hunting for files — it just works.",
    name: 'Operations Client',
    role: 'Notion Workspace Project',
  },
  {
    quote:
      "Every frame felt intentional. The lookbook came together like a real fashion story, not a collection of pictures.",
    name: 'Photoshoot Client',
    role: 'Lookbook Production',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const timer = useRef(0);

  const go = (nextDir) => {
    setDir(nextDir);
    setIndex((i) => (i + nextDir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (paused) return undefined;
    timer.current = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(timer.current);
  }, [paused]);

  const current = TESTIMONIALS[index];

  return (
    <section className="testimonials">
      <div className="container">
        <Reveal>
          <div className="t-head">
            <span className="eyebrow">Kind Words</span>
            <h2 className="display">What clients <em>say</em></h2>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div
            className="t-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="t-mark" aria-hidden="true">
              &ldquo;
            </div>

            <div className="t-stage">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.blockquote
                  key={index}
                  custom={dir}
                  initial={{ opacity: 0, x: dir === 1 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir === 1 ? -40 : 40 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="t-quote"
                >
                  <p>{current.quote}</p>
                  <footer>
                    <strong>{current.name}</strong>
                    <span>{current.role}</span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="t-nav">
              <button
                className="t-arrow"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
              >
                &#8592;
              </button>
              <div className="t-dots" role="tablist" aria-label="Testimonials">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`t-dot${i === index ? ' active' : ''}`}
                    onClick={() => {
                      setDir(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                  />
                ))}
              </div>
              <button
                className="t-arrow"
                onClick={() => go(1)}
                aria-label="Next testimonial"
              >
                &#8594;
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}