import { motion } from 'motion/react';
import { useLightbox } from '../lightbox/LightboxProvider.jsx';
import Reveal from './Reveal.jsx';

const OFFERINGS = [
  {
    num: '01',
    title: 'Brand Identity',
    text: 'Full visual systems — logo, palette, type, packaging, and street presence designed as one voice.',
    tags: ['Logo', 'Packaging', 'Guidelines'],
    preview: '/projects/find-folds-brand-kit.jpg',
  },
  {
    num: '02',
    title: 'Notion Workspaces',
    text: 'Organized, systemized workspaces that structure operations, projects, and teams so nothing gets lost.',
    tags: ['Setup', 'Templates', 'Automation'],
    preview: '/projects/donut-1.jpg',
  },
  {
    num: '03',
    title: 'Editorial & Covers',
    text: 'Magazine covers and editorial layouts with considered type, deliberate color, and a point of view.',
    tags: ['Layout', 'Cover Design', 'Print'],
    preview: '/projects/magazine-cover.jpg',
  },
  {
    num: '04',
    title: 'Lookbooks & Direction',
    text: 'Styled visual stories — lookbooks, photography direction, and art direction for a signature feel.',
    tags: ['Styling', 'Direction', 'Story'],
    preview: '/lookbook/lookbook-01.jpg',
  },
];

export default function Offerings({ images }) {
  const { open } = useLightbox();

  const openPreview = (i) => {
    const src = OFFERINGS[i].preview;
    open([{ src, caption: `${OFFERINGS[i].title} — preview` }], 0);
  };

  return (
    <section id="offerings" className="section offerings">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Offerings</span>
              <h2 className="display">What I do</h2>
            </div>
            <p className="section-note">
              Creative work and systems built to be seen, used, and remembered.
            </p>
          </div>
        </Reveal>

        <div className="offering-grid">
          {OFFERINGS.map((o, i) => (
            <motion.a
              key={o.num}
              className="offering-card"
              href="#contact"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover="hover"
            >
              <div className="offering-num">{o.num}</div>
              <div className="offering-body">
                <div className="offering-visual" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPreview(i); }}>
                  <motion.img
                    src={o.preview}
                    alt=""
                    loading="lazy"
                    variants={{ hover: { scale: 1.08 } }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <span className="offering-zoom" aria-hidden="true">&#8612;</span>
                </div>
                <h3 className="offering-title">{o.title}</h3>
                <p className="offering-text">{o.text}</p>
                <div className="offering-tags">
                  {o.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="offering-arrow" aria-hidden="true">
                <motion.span variants={{ hover: { x: 6 } }} transition={{ duration: 0.4 }}>
                  &#8594;
                </motion.span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}