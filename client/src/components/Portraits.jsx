import { motion } from 'motion/react';
import Reveal from './Reveal.jsx';

const TAGS = {
  official: 'Official',
  photoshoot: 'Editorial',
  barbie: 'Playful',
};

export default function Portraits({ images }) {
  return (
    <section className="portraits">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Studio</span>
              <h2 className="display">In Front of the Lens</h2>
            </div>
            <p className="section-note">Portraits and editorial frames from the studio.</p>
          </div>
        </Reveal>

        <div className="portraits-grid">
          {images.map((src, i) => {
            const key = src.split('/').pop();
            return (
              <motion.figure
                className="portrait-item"
                key={src}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={src} alt={`Studio portrait — ${TAGS[key] || 'Editorial'}`} loading="lazy" />
                <span className="tag">{TAGS[key] || 'Editorial'}</span>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
