import { useEffect, useState } from 'react';
import { loadManifest } from './data.js';
import Inbox from './components/Inbox.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Lookbook from './components/Lookbook.jsx';
import Projects from './components/Projects.jsx';
import Portraits from './components/Portraits.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    if (window.location.hash === '#/inbox') {
      setManifest({ inbox: true });
      return;
    }
    loadManifest().then(setManifest).catch(() => {});
  }, []);

  if (!manifest) return null;

  if (manifest.inbox) return <Inbox />;

  const heroImage = manifest.portraits.find((p) => p.includes('photoshoot')) || manifest.portraits[0];
  const aboutImage = manifest.portraits.find((p) => p.includes('official')) || manifest.portraits[1];

  return (
    <>
      <Nav />
      <Hero portrait={heroImage} official={aboutImage} />
      <Marquee />
      <Lookbook images={manifest.lookbook} />
      <Projects images={manifest.projects} />
      <Portraits images={manifest.portraits} />
      <About photo={aboutImage} />
      <Contact />
      <Footer />
    </>
  );
}
