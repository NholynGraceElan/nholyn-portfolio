const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/', short: 'IG' },
  { label: 'Facebook', href: 'https://www.facebook.com/', short: 'FB' },
  { label: 'TikTok', href: 'https://www.tiktok.com/', short: 'TT' },
  { label: 'Email', href: 'mailto:estilgrace@gmail.com', short: '@' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          Nholyn <em>Grace</em>
        </div>
        <div className="footer-links">
          <a href="#offerings">Offerings</a>
          <a href="#lookbook">Lookbook</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className="footer-social">
        <span className="footer-social-label">Follow along</span>
        <div className="footer-social-links">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              <span className="social-short">{s.short}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Nholyn Grace. All rights reserved.</span>
        <span>Made with intention, designed with a point of view.</span>
      </div>
    </footer>
  );
}