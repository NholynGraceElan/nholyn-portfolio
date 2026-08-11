import Reveal from './Reveal.jsx';

const STATS = [
  { n: '22', l: 'Lookbook looks' },
  { n: '18+', l: 'Projects delivered' },
];

export default function About({ photo }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about">
          <Reveal className="about-art">
            {photo && <img src={photo} alt="Nholyn Grace — studio portrait" />}
          </Reveal>
          <div className="about-copy">
            <Reveal>
              <span className="eyebrow">About</span>
              <h2 className="display">
                Design that feels <em>alive</em>.
              </h2>
              <p>
                I'm Nholyn Grace — a designer and creative director who treats every
                project like a story worth telling. From full brand kits to single editorial
                frames, I build work with intention: considered type, deliberate color, and a
                point of view that doesn't fade in a feed.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="stats">
                {STATS.map((s) => (
                  <div className="stat" key={s.l}>
                    <div className="n">{s.n}</div>
                    <div className="l">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
