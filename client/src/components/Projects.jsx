import { motion } from 'motion/react';
import Reveal from './Reveal.jsx';

const META = {
  'find-folds-brand-kit.jpg': { title: 'Find & Folds', tag: 'Brand Kit' },
  'find-folds-logo.jpg': { title: 'Find & Folds', tag: 'Logo' },
  'find-folds-paper-bag.jpg': { title: 'Find & Folds', tag: 'Packaging' },
  'find-folds-street.jpg': { title: 'Find & Folds', tag: 'Street Scene' },
  'bread-studio-logo.jpg': { title: 'Bread Design Studio', tag: 'Logo' },
  'donut-1.jpg': { title: 'Notion Workspace', tag: 'Sample 01' },
  'donut-2.jpg': { title: 'Notion Workspace', tag: 'Sample 02' },
  'donut-3.jpg': { title: 'Notion Workspace', tag: 'Sample 03' },
  'magazine-cover.jpg': { title: 'Jean Mara Andoy', tag: 'Magazine Cover' },
  'book-page.jpg': { title: 'Nholyn Grace', tag: 'Book Page' },
  'lookbook-cover.jpg': { title: 'Single Lookbook', tag: 'Cover' },
  'want-font.jpg': { title: 'Nholyn Grace', tag: 'Typography Study' },
  'andy-mc.jpg': { title: 'Andy', tag: 'Magazine Cover' },
  'king-mark-mc.jpg': { title: 'King Mark', tag: 'Magazine Cover' },
  'rico-mc.jpg': { title: 'Rico', tag: 'Magazine Cover' },
  'mark-anthony-mc.jpg': { title: 'Mark Anthony', tag: 'Magazine Cover' },
  'second-mc.jpg': { title: 'Magazine Cover', tag: 'Issue 02' },
  'third-mc.jpg': { title: 'Magazine Cover', tag: 'Issue 03' },
};

function Plate({ src, index, className = '', big = false }) {
  const key = src.split('/').pop();
  const meta = META[key] || { title: 'Project', tag: '' };
  return (
    <motion.figure
      className={`plate${big ? ' plate--feature' : ''} ${className}`.trim()}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="plate-frame">
        <img src={src} alt={`${meta.title} — ${meta.tag}`} loading="lazy" />
      </div>
      <figcaption className="plate-cap">
        <strong>{meta.title}</strong>
        <span>{meta.tag}</span>
      </figcaption>
    </motion.figure>
  );
}

function GroupHead({ num, name, note }) {
  return (
    <Reveal>
      <div className="proj-title">
        <span className="num">{num}</span>
        {name}
      </div>
      {note && <p className="proj-note">{note}</p>}
    </Reveal>
  );
}

export default function Projects({ images }) {
  const findFolds = images.slice(0, 4);
  const [brandKit, ...findFoldsRest] = findFolds;
  const bread = images[4];
  const donuts = images.slice(5, 8);
  const editorial = images.slice(8, 12);
  const live = images.slice(12, 18);

  return (
    <section id="work" className="section projects">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Selected Work</span>
              <h2 className="display">Projects &amp; Collabs</h2>
            </div>
            <p className="section-note">
              Brand systems, Notion workspace samples, editorial prints, and magazine cover craft.
            </p>
          </div>
        </Reveal>

        {/* I — Find & Folds, brand identity showcase */}
        <div className="proj-group">
          <GroupHead num="I" name="Find & Folds — Brand Identity" />
          <div className="ff-showcase">
            <Plate src={brandKit} index={0} big />
            <Reveal delay={0.1} className="ff-info">
              <span className="eyebrow">Identity &amp; Brand</span>
              <h3 className="display">Find &amp; Folds</h3>
              <p>
                A complete brand system — logo, packaging, and street presence designed as one
                voice. Every piece is shown whole, exactly as designed.
              </p>
              <div className="ff-tags">
                <span>Logo</span>
                <span>Packaging</span>
                <span>Street Presence</span>
              </div>
            </Reveal>
          </div>
          <div className="plates plates--trio">
            {findFoldsRest.map((src, i) => (
              <Plate key={src} src={src} index={i + 1} />
            ))}
          </div>
          <div className="plates plates--single">
            <Plate src={bread} index={0} />
          </div>
        </div>

        {/* II — Notion workspace samples */}
        <div className="proj-group">
          <GroupHead
            num="II"
            name="Notion Workspace Samples"
            note="Donut company sample projects organized inside a Notion workspace."
          />
          <div className="plates plates--trio">
            {donuts.map((src, i) => (
              <Plate key={src} src={src} index={i} />
            ))}
          </div>
        </div>

        {/* III — Editorial print */}
        <div className="proj-group">
          <GroupHead num="III" name="Editorial Print" />
          <div className="plates plates--four">
            {editorial.map((src, i) => (
              <Plate key={src} src={src} index={i} />
            ))}
          </div>
        </div>

        {/* IV — Magazine covers */}
        <div className="proj-group">
          <GroupHead num="IV" name="Magazine Covers" />
          <div className="plates plates--six">
            {live.map((src, i) => (
              <Plate key={src} src={src} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
