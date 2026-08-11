import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Reveal from './Reveal.jsx';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState('idle'); // idle | sending | ok | error
  const [error, setError] = useState('');

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setState('ok');
      setForm(EMPTY);
    } catch {
      setState('error');
      setError('Network error. Please try again.');
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact-wrap">
          <Reveal>
            <span className="eyebrow">Contact</span>
            <h2 className="display">
              Let's create <em>something</em>.
            </h2>
            <p className="intro">
              Have a brand, a collection, or a cover in mind? Tell me about it — I'll get
              back to you within a day.
            </p>

            <div className="contact-meta">
              <div>
                <strong>Email</strong>
                estilgrace@gmail.com
              </div>
              <div>
                <strong>Based in</strong>
                Philippines · GMT+8
              </div>
              <div>
                <strong>Focus</strong>
                Turning Details Into Momentum
              </div>
            </div>

            <div className="secure-note">
              <span className="lock" aria-hidden="true">&#128274;</span>
              Messages are encrypted with AES-256-GCM before storage and visible only to Nholyn.
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="form" onSubmit={submit} noValidate>
              <div className="hp" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={update} placeholder="Your name" required maxLength={60} />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required maxLength={120} />
              </div>

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={update} placeholder="Brand, lookbook, cover…" maxLength={120} />
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={form.message} onChange={update} placeholder="Tell me about your project…" required minLength={10} maxLength={2000} />
              </div>

              <AnimatePresence mode="wait">
                {state === 'ok' && (
                  <motion.div
                    key="ok"
                    className="form-success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span aria-hidden="true">&#10003;</span>
                    <span>Message received — encrypted and safely stored. Talk soon.</span>
                  </motion.div>
                )}
                {state === 'error' && (
                  <motion.div
                    key="err"
                    className="form-error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" className="btn btn-solid" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
