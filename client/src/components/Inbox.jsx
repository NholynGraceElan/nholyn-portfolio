import { useEffect, useState } from 'react';

export default function Inbox() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/api/admin/status', { credentials: 'include' })
      .then((r) => {
        if (r.ok) setAuthed(true);
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/admin/messages', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => {});
  }, [authed]);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setBusy(false);
        return;
      }
      setAuthed(true);
    } catch {
      setError('Network error.');
    }
    setBusy(false);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setAuthed(false);
    setMessages([]);
  };

  const remove = async (id) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE', credentials: 'include' });
    setMessages((m) => m.filter((x) => x.id !== id));
  };

  const fmt = (iso) =>
    new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div style={{ minHeight: '100vh', background: '#f8e8d8', color: '#31160f', fontFamily: 'Jost, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '2.2rem' }}>
            Nholyn <em style={{ color: '#530f0e' }}>Inbox</em>
          </h1>
          {authed && (
            <button
              onClick={logout}
              style={{ background: 'none', border: '1px solid #530f0e', color: '#530f0e', padding: '0.4rem 1rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Log out
            </button>
          )}
        </div>

        {checking ? (
          <p>Checking…</p>
        ) : !authed ? (
          <form
            onSubmit={login}
            style={{ display: 'grid', gap: '1rem', maxWidth: 360, marginTop: '2rem' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #601c27', background: '#fdf3e6', color: '#31160f', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #601c27', background: '#fdf3e6', color: '#31160f', fontFamily: 'inherit' }}
              />
            </div>
            {error && <p style={{ color: '#a03040', fontSize: '0.85rem' }}>{error}</p>}
            <button
              type="submit"
              disabled={busy}
              style={{ background: '#530f0e', color: '#f8e8d8', border: 'none', padding: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : messages.length === 0 ? (
          <p style={{ marginTop: '2rem', opacity: 0.7 }}>No messages yet. The inbox is empty.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
            {messages.map((m) => (
              <div key={m.id} style={{ background: '#fdf3e6', border: '1px solid rgba(83,15,14,0.25)', padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.4rem' }}>
                  <strong>{m.decrypted.name}</strong>
                  <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{fmt(m.createdAt)}</span>
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  {m.decrypted.email}
                  {m.decrypted.subject ? ` · ${m.decrypted.subject}` : ''}
                </div>
                <p style={{ marginTop: '0.6rem', whiteSpace: 'pre-wrap' }}>{m.decrypted.message}</p>
                <button
                  onClick={() => remove(m.id)}
                  style={{ marginTop: '0.8rem', background: 'none', border: 'none', color: '#a03040', fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <a href="#top" style={{ display: 'inline-block', marginTop: '2.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#601c27' }}>
          &larr; Back to portfolio
        </a>
      </div>
    </div>
  );
}
