import { motion } from 'motion/react';
import Reveal from './Reveal.jsx';
import { useLightbox } from '../lightbox/LightboxProvider.jsx';

const TAGS = {
  official: 'Official',
  photoshoot: 'Editorial',
  barbie: 'Playful',
};

export default function Portraits({ images }) {
  const { open } = useLightbox();

  const openAt = (i) => {
    open(
      images.map((src) => {
        const key = src.split('/').pop();
        return { src, caption: TAGS[key] || 'Editorial' };
      }),
      i
    );
  };

  return (
    <section className="portraits">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Studio</span>
              <h2 className="display">In Front of the Lens</h2>
            </div>
            <p className="section-note">Portraits and editorial frames from the studio. Click to view full size.</p>
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
                <button className="portrait-view" onClick={() => openAt(i)} aria-label={`View ${TAGS[key] || 'Editorial'} portrait full size`}>
                  <img src={src} alt={`Studio portrait — ${TAGS[key] || 'Editorial'}`} loading="lazy" />
                  <span className="portrait-zoom" aria-hidden="true">&#8682;</span>
                </button>
                <span className="tag">{TAGS[key] || 'Editorial'}</span>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}