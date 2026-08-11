export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          Nholyn <em>Grace</em>
        </div>
        <div className="footer-links">
          <a href="#lookbook">Lookbook</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Nholyn Grace. All rights reserved.</span>
      </div>
    </footer>
  );
}
